import ee, os
import datetime, pytz
import fiona

# repository containing all the gold mine rasters
IMAGE_REPO = 'users/nk-sig/GoldMineProbabilities'


#function to authenticate GEE
def authGEE():
    ee.Initialize()
    return True

def getImageList():
    assetList = ee.data.getList({'id':IMAGE_REPO})
    return list(map(lambda img: img['id'].split('/')[-1], assetList))


def getLatestImage():
    imgList = getImageList();
    imgList.sort(reverse=True)
    latest = imgList[0]
    y, m, d = list(map(lambda x: int(x), latest.split('-')));
    return ee.Image(IMAGE_REPO+'/'+latest), datetime.datetime(y,m,d).replace(tzinfo=pytz.UTC)


def getShape(region, level):
    module_dir = os.path.dirname(__file__)
    shapefile = os.path.join(module_dir,'shapes','Level'+str(level)+'.shp')
    iterator = fiona.open(shapefile)

    if (level == 0):
        return next(iter(iterator))
    elif (level == 1):
        for feature in iterator:
            if (feature['properties']['admin1RefN'] == region):
                return feature
    elif (level == 2):
        for feature in iterator:
            if (feature['properties']['admin2RefN'] == region):
                return feature


def reduceRegion(shapeObj,raster):
    authGEE()
    polygon = ee.Geometry.MultiPolygon(shapeObj['coordinates']);
    value = raster.reduceRegion(ee.Reducer.sum(), polygon, 30, bestEffort = True)
    return value.getInfo()['b1']>0


def getDefaultStyled(img):
    img = img.selfMask()
    visparams = {'palette':['f00']}
    mapid = ee.data.getTileUrl(img.getMapId(visparams),0,0,0)[:-5]+'{z}/{x}/{y}'
    return {'url':mapid,'visparams':visparams}