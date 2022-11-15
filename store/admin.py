from django.contrib import admin, messages
from django.db.models import Count
from django.utils.html import format_html, urlencode
from django.urls import reverse
from . import models


@admin.register(models.Promotion)
class PromotionAdmin(admin.ModelAdmin):
    list_display = ['description', 'discount', 'start_date', 'end_date']
    list_editable = ['discount', 'end_date']
    list_per_page = 10


@admin.register(models.Collection)
class CollectionAdmin(admin.ModelAdmin):
    list_display = ['title', 'products_count']

    @admin.display(ordering='products_count')
    def products_count(self, collection):
        url = (reverse('admin:store_product_changelist') + '?' +
               urlencode({'collection__id': str(collection.id)}))
        return format_html('<a href="{}">{}</a>', url, collection.products_count)

    def get_queryset(self, request):
        return super().get_queryset(request).annotate(products_count=Count('products'))


@admin.register(models.Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['title', 'description', 'price',
                    'collection', 'inventory', 'inventory_status']
    list_editable = ['price', 'inventory']
    list_filter = ['collection', 'last_update']
    list_per_page = 10

    @admin.display(ordering='inventory')
    def inventory_status(self, product):
        if product.inventory < 10:
            return 'LOW'
        else:
            return 'OK'


@admin.register(models.Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'last_name',
                    'email', 'phone', 'membership', 'orders_count']
    list_editable = ['membership']
    list_per_page = 10
    list_select_related = ['user']
    ordering = ['user__first_name', 'user__last_name']
    search_fields = ['user__first_name__istartswith',
                     'user__last_name__istartswith']

    @admin.display(ordering='orders_count')
    def orders_count(self, customer):
        url = (reverse('admin:store_order_changelist') + '?' +
               urlencode({'customer__id': str(customer.id)}))
        return format_html('<a href="{}">{}<a/>', url, customer.orders_count)

    def get_queryset(self, request):
        return super().get_queryset(request).annotate(orders_count=Count('orders'))


@admin.register(models.Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['placed_at', 'payment_status', 'customer']
    list_per_page = 10


class QuantityFilter(admin.SimpleListFilter):
    title = 'quantity'
    parameter_name = 'quantity'

    def lookups(self, request, model_admin):
        return [('<4', 'Low'), ('>=4', 'High')]

    def queryset(self, request, queryset):
        if self.value() == '<4':
            return queryset.filter(quantity__lt=4)
        if self.value() == '>=4':
            return queryset.filter(quantity__gte=4)


@admin.register(models.OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['quantity', 'unit_price', 'product']
    list_filter = [QuantityFilter, 'product']
    list_per_page = 10
