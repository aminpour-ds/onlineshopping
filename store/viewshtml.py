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

