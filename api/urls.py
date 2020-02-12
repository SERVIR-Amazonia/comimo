# accounts/urls.py
from django.urls import path

from . import views


urlpatterns = [
    path('test/', views.test, name='test'),
    path('getfeaturenames/', views.getFeatureNames, name='getfeaturenames'),
    path('getperufnames/', views.getPeruFeatureNames, name='getperufnames'),
    path('getfeatures/', views.getFeatures, name='getfeatures'),
    path('getimagenames/', views.getImageNames, name='getimagenames'),
    path('getsingleimage/', views.getSingleImage, name='getsingleimage'),
    path('getcompositeimage/', views.getCompositeImage, name='getcompositeimage'),
    path('getlegalmines/', views.getLegalMines, name='getlegalmines'),
    path('getmunicipallayer/', views.getMunicipalLayer, name='getmunicipallayer'),
    path('getcascadingnames/', views.getCascadingFeatureNames, name='getcascadingnames'),
    path('getanpperu/', views.getANPeru, name='getANPPeru'),
    path('getcatmin/', views.getCatMinPeru, name='getcatminperu'),

]
