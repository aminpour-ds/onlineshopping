from django.urls import path, include
from rest_framework_nested import routers
from . import views, viewshtml


router = routers.DefaultRouter()
router.register('products', views.ProductViewSet)
router.register('collections', views.CollectionViewSet)
router.register('carts', views.CartViewSet)
router.register('customers', views.CustomerViewSet)
router.register('orders', views.OrderViewSet, basename='orders')

products_router = routers.NestedDefaultRouter(router, 'products', lookup='product')
products_router.register('reviews', views.ReviewViewSet, basename='product-reviews')
products_router.register('images', views.ProductImageViewSet, basename='product-images')

carts_router = routers.NestedDefaultRouter(router, 'carts', lookup='cart')
carts_router.register('items', views.CartItemViewSet, basename='cart-items')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/', include(products_router.urls)),
    path('api/', include(carts_router.urls)),
]

# =======================================================================================================

html_router = routers.DefaultRouter()
html_router.register('services', viewshtml.Services)

urlpatterns += [
    path('', include(html_router.urls)),    
]