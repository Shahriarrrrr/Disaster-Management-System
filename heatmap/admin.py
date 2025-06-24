from django.contrib import admin
from .models import Heatmap

@admin.register(Heatmap)
class HeatmapAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'type',
        'severity',
        'magnitude',
        'location',
        'date',
        'status',
        'affected_people',
        'casualties',
        'damage_cost',
    )
    list_filter = ('type', 'severity', 'status', 'date')
    search_fields = ('location', 'description')
    ordering = ('-date',)
