from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('program', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='program',
            name='program_duration',
            field=models.IntegerField(),
        ),
    ]
