from rest_framework.viewsets import ModelViewSet
from program.models import Program
from .serializers import ProgramSerializer
from .permissions import IsAdminOrReadOnly

class ProgramView(ModelViewSet):
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer
    permission_classes = [IsAdminOrReadOnly]
