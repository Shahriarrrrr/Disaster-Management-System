from django.apps import AppConfig


class EmergencyrequestConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'emergencyRequest'

    def ready(self):
        import emergencyRequest.signals