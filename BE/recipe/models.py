from django.db import models


class Recipe(models.Model):
    user = models.ForeignKey(
        'accounts.User', on_delete=models.CASCADE, related_name='recipes')

    input_ingredient = models.TextField()
    oven = models.BooleanField(default=False)
    air_fryer = models.BooleanField(default=False)
    gas_stove = models.BooleanField(default=False)
    microwave = models.BooleanField(default=False)
    additional = models.BooleanField(default=True)
    content = models.TextField(blank=True)

    answer = models.TextField(blank=True)
    title = models.CharField(max_length=50, blank=True)
    ingredient = models.TextField(blank=True)
    recipe = models.TextField(blank=True)
    img_url = models.URLField(max_length=400, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)

    class Meta:
        ordering = ['-pk']

    def __str__(self):
        return f"{self.id}: {self.user.email} - {self.input_ingredient}"


class UsageCount(models.Model):
    user = models.OneToOneField(
        'accounts.User', on_delete=models.CASCADE, related_name='usage')
    count = models.IntegerField(default=0)
    used_date = models.DateField(auto_now=True)

    def __str__(self):
        return f"{self.user.email}의 사용량 - {self.count}"
