# Generated by Django 3.1.7 on 2021-05-25 19:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('subscribe', '0016_userminesmodel'),
    ]

    operations = [
        migrations.AddField(
            model_name='cronjobs',
            name='email',
            field=models.EmailField(default='', max_length=150),
        ),
    ]
