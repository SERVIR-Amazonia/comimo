# Colombian Mining Monitoring

## Cannonical source
The source of Colombian Mining Monitoring (henceforth referred to as CoMiMo) is [hosted on GitLab.com](https://gitlab.com/sig-gis/gold-mine-watch).

## Installation
### Install git, python and venv
The first step is to install python (3.7.3+) with pip and git. After installing and having the path added as environment variables install virtual environment.
```
$ pip install virtualenv
```
Now, to set up a new virtual environment, the following command can be used
```
$ virtualenv venv
```
*venv* can be replaced witht the name of your choice.

### Install gdal and fiona
The next step is to install  gdal which can get complicated pretty quickly.  

For a windows system a good guide can be [this stack exchange answer](https://gis.stackexchange.com/questions/44958/gdal-importerror-in-python-on-windows). This requires Visual C++ to be installed so install build tools from microsoft and make sure C++ build tools is checked. It can be downloaded [here](https://www.scivision.dev/python-windows-visual-c-14-required/). After gdal is installed, fiona can be installed using pip command.
```
$ pip install fiona
```
There can be a number of issues while installing fiona because of gdal or  other issues, a short troubleshooting list is below:
1. If there is an error on importing gdal or fiona saying
> Can't load requested DLL: C:\ProgramFiles\GDAL\gdalplugins\ogr_MSSQLSpatial.dll
126: The specified module could not be found.

Then delete the file C:\ProgramFiles\GDAL\gdalplugins\ogr_MSSQLSpatial.dll.

2. If there is another error about proj.db
> ERROR 1: PROJ: proj_create_from_database: Cannot find proj.db
PROJ: proj_create_from_database: Cannot find proj.db

Then make sure the projlib folder inside gdal folder is in environment variables with the variable name PROJ_LIB

3. If gdal.h is not found, install fiona directly from a whl file instead which can be downloaded from [https://www.lfd.uci.edu/~gohlke/pythonlibs/#fiona](https://www.lfd.uci.edu/~gohlke/pythonlibs/#fiona) .
```
$ pip install <filename>.whl
```
4. Also, install numpy. No idea why not having it doesn’t tell you- you need it or simply installs it like every other library.
If there are still problems then you should probably go and pray to god and ask why you chose this career.

### Clone the repo Install requirements
Now clone this repository into the system. Activate the virtual environment and install the required packages using pip
```
(venv)$ pip install -r requirements.txt
```
### Install and run CEO gateway
The project connects to CEO through an application package called CEO gateway which uses our credentials to make changes to CEO projects such as create, delete, get info, etc. 
The gateway can be cloned from here
https://github.com/rfontanarosa/ceo-gateway

**src/config.js** needs to be configured with CEO details before it can properly function.

### Additional requirements
Besides the installation and setup for the application there are a few things required for the application to run and function properly. There are some files that are not included in git repository but are essential to the working of the application.

 1. Google Service Account Key
A major requirement for everything to work is a service account for google services to work with GEE. A service account can be created from Google developer console. Creating a key generates a json file that should be placed inside the folder **api** with the name **gee-auth-key.json**. 
IMPORTANT! remember to have the service account address whitelisted by Google earth engine!

 2. gmw/statics/js/appconfigs.js
This file contains the access details to your mapbox and mapquest accounts.
```
mapboxgl.accessToken = '<your access token>';
mapquestkey = '<your key>'
```
2. api/gee-auth-key.json
Your service account key obrained from google developer console. Make sure to activate the address for service account on google earth engine before using it. 

3. api/config.py
This file is intended to contain all the GEE assets relevant to your project and should look something like this
```
# repository containing all the gold mine rasters
IMAGE_REPO = 'users/nk-sig/GoldMineProbabilities'
# asset for legal mines to load as layer
LEGAL_MINES = 'users/nk-sig/Shapes/Legal_Mines'
# asset folder that stores 
POINTS_FOL = 'users/nk-sig/GoldMinePoints'
# levels refer to identifier prefixes for the application
LEVELS = {
    'mun' : 'users/nk-sig/Shapes/Level2',
    'l0' : 'users/nk-sig/Shapes/Level0'
}
# fields are the field names that contain names of the units
FIELDS = {
    'mun' : 'admin2Name'
}
```
4. subscribe/config.py
This file contains the configurations for all the email client to be used as well as the CEO related configurations.
```
EMAIL_HOST_USER = '<your email address>'
EMAIL_HOST_PASSWORD = '<your password>'
APP_URL = '<your app URL>'

CEO_GATEWAY_URL = '<CEO gateway app URL>'
CEO_CREATE = "create-project/"
CEO_INFO = "get-project-stats/"
CEO_DELETE = "delete-project/"
CEO_GETDATA = "get-collected-data/"

PROJ_TITLE_PREFIX = '<prefix for project title>' # to identify in CEO website
PROJ_CLASSES = ['MINE','NOT MINE'] # list of classes for labelling
PLOT_SIZE = 500 # size of plots in meters for CEO Project
```
### Starting and running the django server
1. Run `python manage.py collectstatic` to collect the static files. Type yes to replace the existing files on prompt.

#### Running django through IIS
Feed the application through wfastcgi and IIS

Some resources on how-to:

[https://medium.com/@Jonny_Waffles/deploy-django-on-iis-def658beae92](https://medium.com/@Jonny_Waffles/deploy-django-on-iis-def658beae92)

[https://nitinnain.com/setting-up-and-running-django-on-windows-iis-server/](https://nitinnain.com/setting-up-and-running-django-on-windows-iis-server/)

[https://medium.com/@ayushi21095/steps-to-deploy-python-django-web-application-on-windows-iis-server-379b2b87fcf9](https://medium.com/@ayushi21095/steps-to-deploy-python-django-web-application-on-windows-iis-server-379b2b87fcf9)

### Setting up cronjobs/scheduled tasks
**WIP**