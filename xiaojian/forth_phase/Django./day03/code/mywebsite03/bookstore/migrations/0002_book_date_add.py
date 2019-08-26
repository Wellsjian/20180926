# -*- coding: utf-8 -*-
# Generated by Django 1.11.8 on 2019-07-15 09:01
from __future__ import unicode_literals

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('bookstore', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='book',
            name='date_add',
            field=models.DateTimeField(default=django.utils.timezone.now, verbose_name='开始日期'),
        ),
    ]