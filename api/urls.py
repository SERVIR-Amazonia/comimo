# accounts/urls.py
from django.urls import path

from api.views import getAreaPredicted, getAreaPredictedTS, getDownloadURL, getFeatureNames, \
    getGEETiles, getImageNames, getInfo, getSingleImage


urlpatterns = [
    path('getfeaturenames', getFeatureNames, name='getfeaturenames'),
    path('getimagenames', getImageNames, name='getimagenames'),
    path('getsingleimage', getSingleImage, name='getsingleimage'),
    path('getgeetiles', getGEETiles, name='getgeetiles'),
    path('getdownloadurl', getDownloadURL, name='getdownloadurl'),
    path('getareapredicted', getAreaPredicted, name='getareapredicted'),
    path('getareats', getAreaPredictedTS, name='getareats'),
    path('getinfo', getInfo, name='getinfo')
]
