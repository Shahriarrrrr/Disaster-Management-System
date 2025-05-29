from django.contrib import admin
from .models import Course, Skill

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'level', 'start_date', 'end_date', 'status')
    list_filter = ('level', 'status', 'category')
    search_fields = ('title', 'instructor')

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    search_fields = ('name',)
