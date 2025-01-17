from django.db import models
from user import models as u_model


# Create your models here.

class Topic(models.Model):
    title = models.CharField(verbose_name='文章主题', max_length=50)
    # tec   技术类   no-tec  非技术类
    category = models.CharField(verbose_name='文章分类', max_length=20)
    # public  公开的  private  私有的
    limit = models.CharField(verbose_name='文章权限', max_length=10)
    introduce = models.CharField(verbose_name='博客简介', max_length=90)
    content = models.TextField(verbose_name='博客内容')
    created_time = models.DateTimeField(verbose_name='创建时间', auto_now_add=True)
    modified_time = models.DateTimeField(verbose_name='修改时间', auto_now=True)
    author = models.ForeignKey(u_model.UserProfile)

    def __str__(self):
        return '文章主题' + self.title

    class Meta:
        db_table = 'topic'
