# Generated by Django 2.2 on 2020-01-22 02:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('subscribe', '0003_auto_20200118_2304'),
    ]

    operations = [
        migrations.AddField(
            model_name='subscribemodel',
            name='level',
            field=models.IntegerField(default=0),
        ),
    ]