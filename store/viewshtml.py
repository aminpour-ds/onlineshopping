from rest_framework.renderers import TemplateHTMLRenderer
from .import views


class Services(views.ProductViewSet):    
    renderer_classes = [TemplateHTMLRenderer]

    def get_template_names(self):
        if self.action == 'list':
            template_name = ['services.html']
        elif self.action == 'retrieve':
            template_name = ['service-detail.html']
        return template_name


class Index(views.ProductViewSet):    
    renderer_classes = [TemplateHTMLRenderer]
    template_name = 'index.html'


class Orders(views.OrderViewSet):
    renderer_classes = [TemplateHTMLRenderer]
    template_name = 'orders.html'

