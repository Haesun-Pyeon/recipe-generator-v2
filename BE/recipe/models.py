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

    answer = models.TextField(blank=True, null=True)
    title = models.CharField(max_length=100, blank=True, null=True)
    ingredient = models.TextField(blank=True, null=True)
    recipe = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)

    def __str__(self):
        return f"{self.id}: {self.user.email} - {self.title}"


class UsageCount(models.Model):
    user = models.OneToOneField(
        'accounts.User', on_delete=models.CASCADE, related_name='usage')
    count = models.IntegerField(default=0)

    def __str__(self):
        return f"Usage Count for {self.user.username}"
