# Generated by Django 2.2 on 2020-01-17 23:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('subscribe', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='subscribemodel',
            name='email',
            field=models.EmailField(blank=True, max_length=200),
        ),
    ]