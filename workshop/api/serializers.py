from rest_framework import serializers
from workshop.models import Course, Skill

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name']

class CourseSerializer(serializers.ModelSerializer):
    skills = SkillSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = [
            'id', 'title', 'category', 'duration', 'level', 'instructor',
            'start_date', 'end_date', 'max_participants', 'enrolled',
            'description', 'skills', 'certification', 'cost', 'location', 'status'
        ]

class CourseCreateUpdateSerializer(serializers.ModelSerializer):
    skill_ids = serializers.PrimaryKeyRelatedField(
        queryset=Skill.objects.all(), many=True, write_only=True
    )

    class Meta:
        model = Course
        fields = [
            'title', 'category', 'duration', 'level', 'instructor',
            'start_date', 'end_date', 'max_participants', 'enrolled',
            'description', 'skill_ids', 'certification', 'cost', 'location', 'status'
        ]

    def create(self, validated_data):
        skills = validated_data.pop('skill_ids')
        course = Course.objects.create(**validated_data)
        course.skills.set(skills)
        return course

    def update(self, instance, validated_data):
        skills = validated_data.pop('skill_ids')
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        instance.skills.set(skills)
        return instance
