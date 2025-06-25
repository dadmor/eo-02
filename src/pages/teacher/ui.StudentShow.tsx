// src/pages/teacher/ui.StudentShow.tsx
import { useShow, useNavigation, useList } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Edit, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin,
  GraduationCap,
  Award,
  TrendingUp,
  FileText,
  Star,
  Target,
  Flame,
  BookOpen,
  User
} from "lucide-react";
import { FlexBox, GridBox } from "@/components/shared";
import { Lead } from "@/components/reader";
import { useParams } from "react-router-dom";

export const routeConfig = { path: "/teacher/students/:id", title: "Student Details" };

interface Student extends BaseRecord {
  name?: string;
  email?: string;
  avatar_url?: string;
  status?: string;
  class_name?: string;
  grade?: string;
  level?: number;
  xp?: number;
  streak?: number;
  notes?: string;
  learning_preferences?: string;
  birth_date?: string;
  address?: string;
  parent_email?: string;
  created_at?: string;
  class_id?: string;
  phone?: string;
}

export default function StudentShow() {
  const { id } = useParams();
  const { goBack, edit } = useNavigation();

  const { queryResult } = useShow({
    resource: "students",
    id: id!,
  });

  // Pobierz prace ucznia
  const { data: submissions } = useList({
    resource: "submissions",
    filters: [
      {
        field: "student_id",
        operator: "eq",
        value: id,
      },
    ],
    sorters: [
      {
        field: "submitted_at",
        order: "desc",
      },
    ],
    pagination: {
      pageSize: 10,
    },
  });

  // Pobierz zadania dla klas ucznia
  const { data: assignments } = useList({
    resource: "assignments",
    filters: [
      {
        field: "class_id",
        operator: "eq",
        value: queryResult.data?.class_id,
      },
    ],
    queryOptions: {
      enabled: !!queryResult.data?.class_id,
    },
  });

  const { data: studentData, isLoading } = queryResult;

  const student = studentData as Student;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <Card>
        <CardContent className="text-center py-16">
          <h3 className="text-lg font-medium mb-2">Uczeń nie został znaleziony</h3>
          <p className="text-muted-foreground mb-4">
            Nie można znaleźć ucznia o podanym identyfikatorze.
          </p>
          <Button onClick={() => goBack()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Wstecz
          </Button>
        </CardContent>
      </Card>
    );
  }

  const submissionList = submissions?.data || [];
  const assignmentList = assignments?.data || [];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'suspended': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Aktywny';
      case 'inactive': return 'Nieaktywny';
      case 'suspended': return 'Zawieszony';
      default: return status;
    }
  };

  // Oblicz statystyki
  const gradedSubmissions = submissionList.filter(s => s.status === 'graded');
  const averageGrade = gradedSubmissions.length > 0 
    ? gradedSubmissions.reduce((sum, s) => sum + (s.grade || 0), 0) / gradedSubmissions.length 
    : 0;
  
  const completionRate = assignmentList.length > 0 
    ? (submissionList.length / assignmentList.length) * 100 
    : 0;

  // Oblicz postęp do następnego poziomu (zakładając 1000 XP na poziom)
  const xpForNextLevel = (studentData.level || 1) * 1000;
  const currentLevelXp = ((studentData.level || 1) - 1) * 1000;
  const progressToNextLevel = ((studentData.xp || 0) - currentLevelXp) / (xpForNextLevel - currentLevelXp) * 100;

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => goBack()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Wstecz
          </Button>
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={studentData.avatar_url} />
              <AvatarFallback>
                {getInitials(studentData.name || studentData.email || 'UN')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{studentData.name}</h1>
              <p className="text-muted-foreground">{studentData.email}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant={getStatusColor(studentData.status)}>
            {getStatusLabel(studentData.status)}
          </Badge>
          <Button onClick={() => edit("students", studentData.id)}>
            <Edit className="w-4 h-4 mr-2" />
            Edytuj ucznia
          </Button>
        </div>
      </div>

      <GridBox>
        {/* Personal Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Informacje osobiste
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {studentData.email && (
              <FlexBox>
                <span className="text-sm font-medium flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  Email
                </span>
                <span className="text-sm">{studentData.email}</span>
              </FlexBox>
            )}

            {studentData.phone && (
              <FlexBox>
                <span className="text-sm font-medium flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  Telefon
                </span>
                <span className="text-sm">{studentData.phone}</span>
              </FlexBox>
            )}

            {studentData.birth_date && (
              <FlexBox>
                <span className="text-sm font-medium flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Data urodzenia
                </span>
                <span className="text-sm">
                  {new Date(studentData.birth_date).toLocaleDateString()}
                </span>
              </FlexBox>
            )}

            {studentData.address && (
              <FlexBox>
                <span className="text-sm font-medium flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Adres
                </span>
                <span className="text-sm">{studentData.address}</span>
              </FlexBox>
            )}

            {studentData.parent_email && (
              <FlexBox>
                <span className="text-sm font-medium">Email rodzica</span>
                <span className="text-sm">{studentData.parent_email}</span>
              </FlexBox>
            )}

            <FlexBox>
              <span className="text-sm font-medium">Data dołączenia</span>
              <span className="text-sm">
                {new Date(studentData.created_at).toLocaleDateString()}
              </span>
            </FlexBox>
          </CardContent>
        </Card>

        {/* Academic Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Informacje akademickie
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {studentData.class_name && (
              <FlexBox>
                <span className="text-sm font-medium">Klasa</span>
                <Badge variant="outline">{studentData.class_name}</Badge>
              </FlexBox>
            )}

            {studentData.grade && (
              <FlexBox>
                <span className="text-sm font-medium">Poziom</span>
                <Badge variant="outline">{studentData.grade}</Badge>
              </FlexBox>
            )}

            <FlexBox>
              <span className="text-sm font-medium">Średnia ocen</span>
              <Badge variant="secondary" className={
                averageGrade >= 4.5 ? 'bg-green-100 text-green-800' :
                averageGrade >= 3.5 ? 'bg-blue-100 text-blue-800' :
                averageGrade >= 2.5 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }>
                {averageGrade > 0 ? averageGrade.toFixed(1) : 'Brak ocen'}
              </Badge>
            </FlexBox>

            <FlexBox>
              <span className="text-sm font-medium">Wykonanie zadań</span>
              <div className="flex items-center gap-2">
                <Progress value={completionRate} className="w-20" />
                <span className="text-sm">{completionRate.toFixed(0)}%</span>
              </div>
            </FlexBox>

            <FlexBox>
              <span className="text-sm font-medium">Oddane prace</span>
              <Badge variant="outline">
                {submissionList.length}/{assignmentList.length}
              </Badge>
            </FlexBox>
          </CardContent>
        </Card>
      </GridBox>

      {/* Gamification Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Statystyki gracza
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center">
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">Poziom {studentData.level || 1}</div>
                <div className="text-sm text-muted-foreground">Obecny poziom</div>
                <div className="mt-2">
                  <Progress value={Math.max(0, Math.min(100, progressToNextLevel))} className="w-full" />
                  <div className="text-xs text-muted-foreground mt-1">
                    {studentData.xp || 0} / {xpForNextLevel} XP
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center space-y-2">
              <div className="flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{studentData.xp || 0}</div>
                <div className="text-sm text-muted-foreground">Punkty XP</div>
              </div>
            </div>

            <div className="text-center space-y-2">
              <div className="flex items-center justify-center">
                <Flame className="w-8 h-8 text-orange-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{studentData.streak || 0}</div>
                <div className="text-sm text-muted-foreground">Seria dni</div>
              </div>
            </div>

            <div className="text-center space-y-2">
              <div className="flex items-center justify-center">
                <Target className="w-8 h-8 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{gradedSubmissions.length}</div>
                <div className="text-sm text-muted-foreground">Ukończone zadania</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <GridBox>
        {/* Recent Submissions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Ostatnie prace ({submissionList.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {submissionList.length > 0 ? (
              <div className="space-y-3">
                {submissionList.slice(0, 5).map((submission: any) => (
                  <div key={submission.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{submission.assignment_title}</h4>
                      <Badge variant={
                        submission.status === 'graded' ? 'default' :
                        submission.status === 'pending' ? 'secondary' :
                        'outline'
                      }>
                        {submission.status === 'graded' ? 'Ocenione' :
                         submission.status === 'pending' ? 'Do oceny' :
                         submission.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(submission.submitted_at).toLocaleDateString()}
                      </span>
                      {submission.grade !== null && (
                        <span className="flex items-center gap-1 font-medium">
                          <Star className="w-3 h-3" />
                          {submission.grade}/{submission.max_points || 100} pkt
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {submissionList.length > 5 && (
                  <Button variant="ghost" className="w-full">
                    Zobacz wszystkie ({submissionList.length})
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="mb-2">Brak oddanych prac</p>
                <p className="text-sm">Uczeń jeszcze nie oddał żadnych prac</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Notatki i preferencje
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {studentData.notes && (
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Notatki o uczniu</h4>
                <p className="text-sm leading-relaxed">{studentData.notes}</p>
              </div>
            )}

            {studentData.learning_preferences && (
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Preferencje uczenia się</h4>
                <p className="text-sm leading-relaxed">{studentData.learning_preferences}</p>
              </div>
            )}

            {!studentData.notes && !studentData.learning_preferences && (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Brak dodatkowych notatek</p>
              </div>
            )}
          </CardContent>
        </Card>
      </GridBox>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Szybkie akcje</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline"
              onClick={() => edit("students", studentData.id)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edytuj ucznia
            </Button>
            <Button variant="outline">
              <Mail className="w-4 h-4 mr-2" />
              Wyślij wiadomość
            </Button>
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Zobacz wszystkie prace
            </Button>
            <Button variant="outline">
              <Award className="w-4 h-4 mr-2" />
              Przyznaj osiągnięcie
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}