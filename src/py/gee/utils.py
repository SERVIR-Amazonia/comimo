import os
import ee

### Initialize

def initialize(ee_account="", ee_key_path=""):
    try:
        if ee_account and ee_key_path and os.path.exists(ee_key_path):
            credentials = ee.ServiceAccountCredentials(ee_account, ee_key_path)
            ee.Initialize(credentials)
        else:
            ee.Initialize()
    except Exception as e:
        print(e)


### Image helpers

def getImageList(imageFolder):
    assetList = ee.data.getList({"id": imageFolder})
    dates = list(map(lambda img: img["id"].split("/")[-1], assetList))
    dates.sort(reverse=True)
    return dates


def getVectorUrl(source, color, fill):
    table = ee.FeatureCollection(source)
    layer = table.style(color=color, fillColor=fill, width=1)
    mapid = ee.data.getTileUrl(layer.getMapId(), 0, 0, 0)[:-5]+"{z}/{x}/{y}"
    return mapid


def getImageUrl(source, color):
    img = ee.Image(source)
    img = img.select(0).selfMask()
    mapid = ee.data.getTileUrl(img.getMapId({"palette": [color]}), 0, 0, 0)[:-5] + "{z}/{x}/{y}"
    return mapid

def subscribedRegionsToFC(regions):
    regionsFC = ee.FeatureCollection([])
    for region in regions:
        r = region.split("_")
        thisFC = ee.FeatureCollection("users/comimoapp/Shapes/Municipal_Bounds")\
            .filter(ee.Filter.And(
                ee.Filter.eq("DPTO_CNMBR", r[1]),
                ee.Filter.eq("MPIO_CNMBR", r[2])))
        regionsFC = regionsFC.merge(thisFC)
    return regionsFC

def getDownloadURL(source, region, level, scale):
    img = ee.Image(source)
    if (region == "all"):
        regionFC = ee.FeatureCollection("users/comimoapp/Shapes/Level0")
    else:
        regionFC = subscribedRegionsToFC([region])
    img = img.clip(regionFC)
    img.reduceRegion(ee.Reducer.sum(),
                     regionFC.first().geometry(),
                     540,
                     bestEffort=True).getInfo()
    url = img.toByte().getDownloadURL({"region": regionFC.geometry(), "scale": scale})
    return {"action": "success", "url": url}


def imagePointExists(source, lat, lon):
    point = ee.Geometry.Point(lon, lat)
    pointFeature = ee.Feature(point)
    image = ee.Image(source).select([0], ["cval"])
    pt = image.sampleRegions(pointFeature)
    return pt.size().gt(0).getInfo() == 1


def vectorPointOverlaps(source, lat, lon, cols):
    try:
        point = ee.Geometry.Point(lon, lat)
        fc = ee.FeatureCollection(source).filterBounds(point)
        return list(map((lambda c: fc.first().get(c).getInfo()), cols))
    except:
        return None

### Plot helpers


def addBuffer(feature):
    feature.buffer(1000)

def locationInCountry(lat, lon):
    point = ee.Geometry.Point(lon, lat)
    admnames = ee.FeatureCollection(
        "users/comimoapp/Shapes/Level0").filterBounds(point)
    return ee.Algorithms.If(admnames.size().gt(0), True, False).getInfo()





def getPlots(points):
    features = points["features"]
    plots = []
    for feature in features:
        try:
            coords = feature["geometry"]["coordinates"]
            lat = coords[0]
            lon = coords[1]
            plots.append({"lat": lat, "lon": lon})
        except Exception as e:
            print("issue with feature:", feature)
    return plots


def getPointsWithin(regions, dataLayer):
    fc = subscribedRegionsToFC(regions)
    try:
        points = ee.FeatureCollection(POINTS_FOL + "/" + dataLayer)
        return getPlots(points.filterBounds(fc).getInfo())
    except Exception as e:
        print(e)


def statsByRegion(source, subscribedRegions):
    fc = subscribedRegionsToFC(subscribedRegions)
    image = ee.Image(source)
    pa = ee.Image.pixelArea()
    image = image.selfMask().multiply(pa)
    rr = image.reduceRegions(collection=fc,
                                reducer=ee.Reducer.count(),
                                scale=540,
                                crs="EPSG:4326")
    count = rr.aggregate_array("count")
    names = rr.aggregate_array("MPIO_CNMBR")
    resp = ee.Dictionary({"count": count, "names": names}).getInfo()
    resp["action"] = "Success"
    return resp

def statTotals(source, subscribedRegions):
    fc = subscribedRegionsToFC(subscribedRegions)
    def asBands(image, passedImage):
        image = ee.Image(image)
        id = image.id()
        image = image.selfMask()
        passedImage = ee.Image(passedImage)
        return passedImage.addBands(image.rename(id))
    image = ee.Image(ee.ImageCollection(source)
                        .filter(ee.Filter.stringEndsWith("system:index", "-C"))
                        .iterate(asBands, ee.Image()))
    image = image.select(image.bandNames().remove("constant"))
    rr = image.reduceRegion(geometry=fc.geometry(),
                            reducer=ee.Reducer.count(),
                            scale=540,
                            crs="EPSG:4326",
                            bestEffort=True)
    count = rr.values()
    names = rr.keys()
    resp = ee.Dictionary({"count": count, "names": names}).getInfo()
    resp["action"] = "Success"
    return resp
