from django.contrib import admin
from .models import Donation,Funds,FundTransaction

# Register your models here.
admin.site.register(Donation)
admin.site.register(Funds)
admin.site.register(FundTransaction)
