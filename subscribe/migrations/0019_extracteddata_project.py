# Generated by Django 3.1.7 on 2021-08-10 19:30

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('subscribe', '0018_extracteddata_project_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='extracteddata',
            name='project',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='subscribe.projectsmodel'),
        ),
    ]