# Generated by Django 5.2 on 2025-04-22 11:31

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='CustomUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('user_type', models.CharField(choices=[('regular', 'Regular'), ('volunteer', 'Volunteer')], default='regular', max_length=10)),
                ('user_name', models.CharField(max_length=100)),
                ('user_gender', models.CharField(choices=[('M', 'Male'), ('F', 'Female'), ('O', 'Other')], max_length=1)),
                ('user_age', models.PositiveIntegerField()),
                ('user_phone', models.CharField(max_length=15, unique=True)),
                ('user_state', models.CharField(choices=[('Barisal', 'Barisal'), ('Chattogram', 'Chattogram'), ('Dhaka', 'Dhaka'), ('Khulna', 'Khulna'), ('Mymensingh', 'Mymensingh'), ('Rajshahi', 'Rajshahi'), ('Rangpur', 'Rangpur'), ('Sylhet', 'Sylhet')], max_length=100)),
                ('user_address', models.TextField()),
                ('user_profile_image', models.ImageField(blank=True, null=True, upload_to='profile_images/')),
                ('user_nid', models.ImageField(blank=True, null=True, upload_to='nid/')),
                ('is_active', models.BooleanField(default=True)),
                ('is_staff', models.BooleanField(default=False)),
                ('is_superuser', models.BooleanField(default=False)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
