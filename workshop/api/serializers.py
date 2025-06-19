from rest_framework import serializers
from workshop.models import Course, Skill, CourseJoinRequest

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


class CourseJoinRequestSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    course_title = serializers.ReadOnlyField(source='course.title')

    class Meta:
        model = CourseJoinRequest
        fields = [
            'id', 'user', 'course', 'course_title',
            'status', 'message', 'created_at'
        ]
        read_only_fields = ['status', 'created_at']

    def validate(self, attrs):
        # You can add validation logic here (e.g., prevent duplicate pending requests)
        user = self.context['request'].user
        course = attrs.get('course')

        if CourseJoinRequest.objects.filter(user=user, course=course, status='Pending').exists():
            raise serializers.ValidationError("You already have a pending request for this course.")

        if course.participants.filter(id=user.id).exists():
            raise serializers.ValidationError("You are already a participant in this course.")

        return attrs


class CourseJoinRequestUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseJoinRequest
        fields = ['status', 'message']

    def validate_status(self, value):
        if value not in ['Pending', 'Approved', 'Rejected']:
            raise serializers.ValidationError("Invalid status")
        return value
