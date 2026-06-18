import { type FormEvent, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  CalendarDays,
  CheckCircle,
  Layers,
  Link2,
  ListTree,
  Plus,
  RefreshCw,
} from "lucide-react";
import {
  attachCourseSubjects,
  createAdminCourse,
  createAdminProgram,
  createAdminSubject,
  createSubjectDayTopic,
  createSubjectMonth,
  createSubjectWeek,
  getAdminCourseDetails,
  getAdminCourses,
  getAdminPrograms,
  getAdminSubjects,
} from "../../core/admin/admin.api";
import type {
  AdminSubjectDayTopic,
  AdminSubjectMonth,
  AdminSubjectWeek,
} from "../../core/admin/admin.types";

const NAVY = "#0A1628";
const GREEN = "#009E2C";
const TEAL = "#1A7F8E";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Request failed.";
}

function getNumber(formData: FormData, key: string) {
  return Number(formData.get(key) || 0);
}

function getString(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function Field({
  label,
  name,
  placeholder,
  type = "text",
  required = true,
  min,
}: {
  label: string;
  name: string;
  placeholder?: string;
  type?: "text" | "number";
  required?: boolean;
  min?: number;
}) {
  return (
    <label className="space-y-1.5">
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <input
        name={name}
        type={type}
        min={min}
        required={required}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
      />
    </label>
  );
}

function TextArea({ label, name, placeholder }: { label: string; name: string; placeholder?: string }) {
  return (
    <label className="space-y-1.5">
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <textarea
        name={name}
        required
        placeholder={placeholder}
        className="min-h-24 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
      />
    </label>
  );
}

function SubmitButton({
  children,
  disabled,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      style={{ background: GREEN }}
    >
      <Plus className="h-4 w-4" />
      {children}
    </button>
  );
}

function Panel({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof BookOpen;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: `${GREEN}14` }}>
          <Icon className="h-4 w-4" style={{ color: GREEN }} />
        </div>
        <h2 className="text-base font-bold" style={{ color: NAVY }}>
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

export default function AdminCoursesPage() {
  const queryClient = useQueryClient();
  const [selectedProgramId, setSelectedProgramId] = useState<number | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [createdMonths, setCreatedMonths] = useState<AdminSubjectMonth[]>([]);
  const [selectedMonthId, setSelectedMonthId] = useState<number | null>(null);
  const [createdWeeks, setCreatedWeeks] = useState<AdminSubjectWeek[]>([]);
  const [selectedWeekId, setSelectedWeekId] = useState<number | null>(null);
  const [createdDayTopics, setCreatedDayTopics] = useState<AdminSubjectDayTopic[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const programsQuery = useQuery({
    queryKey: ["admin-programs"],
    queryFn: getAdminPrograms,
  });

  const subjectsQuery = useQuery({
    queryKey: ["admin-subjects", selectedProgramId],
    queryFn: () => getAdminSubjects(selectedProgramId!),
    enabled: selectedProgramId !== null,
  });

  const coursesQuery = useQuery({
    queryKey: ["admin-courses", selectedProgramId],
    queryFn: () => getAdminCourses(selectedProgramId!),
    enabled: selectedProgramId !== null,
  });

  const courseDetailsQuery = useQuery({
    queryKey: ["admin-course-details", selectedCourseId],
    queryFn: () => getAdminCourseDetails(selectedCourseId!),
    enabled: selectedCourseId !== null,
  });

  useEffect(() => {
    if (selectedProgramId === null && programsQuery.data?.length) {
      setSelectedProgramId(programsQuery.data[0].id);
    }
  }, [programsQuery.data, selectedProgramId]);

  useEffect(() => {
    setSelectedSubjectId(null);
    setSelectedCourseId(null);
    setCreatedMonths([]);
    setCreatedWeeks([]);
    setCreatedDayTopics([]);
    setSelectedMonthId(null);
    setSelectedWeekId(null);
  }, [selectedProgramId]);

  const createProgramMutation = useMutation({
    mutationFn: createAdminProgram,
    onSuccess: (program) => {
      setStatusMessage(`Program created: ${program.name}`);
      setSelectedProgramId(program.id);
      void queryClient.invalidateQueries({ queryKey: ["admin-programs"] });
    },
  });

  const createSubjectMutation = useMutation({
    mutationFn: createAdminSubject,
    onSuccess: (subject) => {
      setStatusMessage(`Subject created: ${subject.name}`);
      setSelectedSubjectId(subject.id);
      void queryClient.invalidateQueries({ queryKey: ["admin-subjects", selectedProgramId] });
    },
  });

  const createMonthMutation = useMutation({
    mutationFn: ({ subjectId, monthNumber, title }: { subjectId: number; monthNumber: number; title: string }) =>
      createSubjectMonth(subjectId, { monthNumber, title }),
    onSuccess: (month) => {
      setCreatedMonths((current) => [...current, month]);
      setSelectedMonthId(month.id);
      setStatusMessage(`Month created: ${month.title}`);
    },
  });

  const createWeekMutation = useMutation({
    mutationFn: ({ monthId, weekNumber, title }: { monthId: number; weekNumber: number; title: string }) =>
      createSubjectWeek(monthId, { weekNumber, title }),
    onSuccess: (week) => {
      setCreatedWeeks((current) => [...current, week]);
      setSelectedWeekId(week.id);
      setStatusMessage(`Week created: ${week.title}`);
    },
  });

  const createDayTopicMutation = useMutation({
    mutationFn: ({
      weekId,
      dayNumber,
      title,
      description,
      estimatedMinutes,
    }: {
      weekId: number;
      dayNumber: number;
      title: string;
      description: string;
      estimatedMinutes: number;
    }) => createSubjectDayTopic(weekId, { dayNumber, title, description, estimatedMinutes }),
    onSuccess: (topic) => {
      setCreatedDayTopics((current) => [...current, topic]);
      setStatusMessage(`Day topic created: ${topic.title}`);
    },
  });

  const createCourseMutation = useMutation({
    mutationFn: createAdminCourse,
    onSuccess: (course) => {
      setStatusMessage(`Course created: ${course.title}`);
      setSelectedCourseId(course.id);
      void queryClient.invalidateQueries({ queryKey: ["admin-courses", selectedProgramId] });
    },
  });

  const attachSubjectMutation = useMutation({
    mutationFn: ({
      courseId,
      subjectId,
      displayOrder,
      startMonth,
    }: {
      courseId: number;
      subjectId: number;
      displayOrder: number;
      startMonth: number;
    }) => attachCourseSubjects(courseId, { subjects: [{ subjectId, displayOrder, startMonth }] }),
    onSuccess: () => {
      setStatusMessage("Subject attached to course.");
      void queryClient.invalidateQueries({ queryKey: ["admin-course-details", selectedCourseId] });
      void queryClient.invalidateQueries({ queryKey: ["admin-courses", selectedProgramId] });
    },
  });

  const activeError =
    createProgramMutation.error ??
    createSubjectMutation.error ??
    createMonthMutation.error ??
    createWeekMutation.error ??
    createDayTopicMutation.error ??
    createCourseMutation.error ??
    attachSubjectMutation.error ??
    programsQuery.error ??
    subjectsQuery.error ??
    coursesQuery.error ??
    courseDetailsQuery.error;

  function handleCreateProgram(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    createProgramMutation.mutate({
      name: getString(data, "name"),
      code: getString(data, "code"),
    });
    form.reset();
  }

  function handleCreateSubject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (selectedProgramId === null) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    createSubjectMutation.mutate({
      programId: selectedProgramId,
      name: getString(data, "name"),
      description: getString(data, "description"),
      durationMonths: getNumber(data, "durationMonths"),
    });
    form.reset();
  }

  function handleCreateMonth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (selectedSubjectId === null) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    createMonthMutation.mutate({
      subjectId: selectedSubjectId,
      monthNumber: getNumber(data, "monthNumber"),
      title: getString(data, "title"),
    });
    form.reset();
  }

  function handleCreateWeek(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (selectedMonthId === null) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    createWeekMutation.mutate({
      monthId: selectedMonthId,
      weekNumber: getNumber(data, "weekNumber"),
      title: getString(data, "title"),
    });
    form.reset();
  }

  function handleCreateDayTopic(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (selectedWeekId === null) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    createDayTopicMutation.mutate({
      weekId: selectedWeekId,
      dayNumber: getNumber(data, "dayNumber"),
      title: getString(data, "title"),
      description: getString(data, "description"),
      estimatedMinutes: getNumber(data, "estimatedMinutes"),
    });
    form.reset();
  }

  function handleCreateCourse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (selectedProgramId === null) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    createCourseMutation.mutate({
      programId: selectedProgramId,
      title: getString(data, "title"),
      description: getString(data, "description"),
      durationMonths: getNumber(data, "durationMonths"),
      price: getNumber(data, "price"),
    });
    form.reset();
  }

  function handleAttachSubject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (selectedCourseId === null) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    attachSubjectMutation.mutate({
      courseId: selectedCourseId,
      subjectId: getNumber(data, "subjectId"),
      displayOrder: getNumber(data, "displayOrder"),
      startMonth: getNumber(data, "startMonth"),
    });
    form.reset();
  }

  const programs = programsQuery.data ?? [];
  const subjects = subjectsQuery.data ?? [];
  const courses = coursesQuery.data ?? [];
  const selectedSubject = subjects.find((subject) => subject.id === selectedSubjectId);
  const selectedCourse = courses.find((course) => course.id === selectedCourseId);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: NAVY }}>
            Course Builder
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create programs, reusable subjects, daily curriculum, and courses from one workspace.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            void queryClient.invalidateQueries({ queryKey: ["admin-programs"] });
            void queryClient.invalidateQueries({ queryKey: ["admin-subjects", selectedProgramId] });
            void queryClient.invalidateQueries({ queryKey: ["admin-courses", selectedProgramId] });
          }}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-semibold text-foreground transition hover:bg-muted"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {statusMessage && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {statusMessage}
        </div>
      )}

      {activeError && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {getErrorMessage(activeError)}
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
        <div className="space-y-5">
          <Panel title="Programs" icon={Layers}>
            <form className="space-y-3" onSubmit={handleCreateProgram}>
              <Field label="Name" name="name" placeholder="UPSC" />
              <Field label="Code" name="code" placeholder="upsc" />
              <SubmitButton disabled={createProgramMutation.isPending}>Create Program</SubmitButton>
            </form>

            <div className="mt-5 space-y-2">
              {programsQuery.isLoading ? (
                <div className="h-20 animate-pulse rounded-lg bg-muted" />
              ) : programs.length === 0 ? (
                <p className="text-sm text-muted-foreground">No programs created yet.</p>
              ) : (
                programs.map((program) => (
                  <button
                    key={program.id}
                    type="button"
                    onClick={() => setSelectedProgramId(program.id)}
                    className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition ${
                      selectedProgramId === program.id
                        ? "border-secondary bg-secondary/10"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    <span>
                      <span className="block font-semibold text-foreground">{program.name}</span>
                      <span className="text-xs text-muted-foreground">{program.code}</span>
                    </span>
                    {selectedProgramId === program.id && <CheckCircle className="h-4 w-4 text-brand-green" />}
                  </button>
                ))
              )}
            </div>
          </Panel>

          <Panel title="Subjects" icon={BookOpen}>
            <form className="space-y-3" onSubmit={handleCreateSubject}>
              <Field label="Name" name="name" placeholder="Polity" />
              <TextArea label="Description" name="description" placeholder="Indian Constitution and governance." />
              <Field label="Duration Months" name="durationMonths" type="number" min={1} placeholder="3" />
              <SubmitButton disabled={selectedProgramId === null || createSubjectMutation.isPending}>
                Create Subject
              </SubmitButton>
            </form>

            <div className="mt-5 space-y-2">
              {selectedProgramId === null ? (
                <p className="text-sm text-muted-foreground">Select a program to manage subjects.</p>
              ) : subjectsQuery.isLoading ? (
                <div className="h-20 animate-pulse rounded-lg bg-muted" />
              ) : subjects.length === 0 ? (
                <p className="text-sm text-muted-foreground">No subjects in this program yet.</p>
              ) : (
                subjects.map((subject) => (
                  <button
                    key={subject.id}
                    type="button"
                    onClick={() => setSelectedSubjectId(subject.id)}
                    className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                      selectedSubjectId === subject.id
                        ? "border-secondary bg-secondary/10"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    <span className="block font-semibold text-foreground">{subject.name}</span>
                    <span className="text-xs text-muted-foreground">{subject.durationMonths} months</span>
                  </button>
                ))
              )}
            </div>
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel title="Curriculum" icon={ListTree}>
            <div className="mb-4 rounded-lg border border-border bg-background px-3 py-2 text-sm">
              <span className="font-semibold text-foreground">Selected subject:</span>{" "}
              <span className="text-muted-foreground">{selectedSubject?.name ?? "None"}</span>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <form className="space-y-3" onSubmit={handleCreateMonth}>
                <h3 className="text-sm font-bold text-foreground">Month</h3>
                <Field label="Month Number" name="monthNumber" type="number" min={1} placeholder="1" />
                <Field label="Title" name="title" placeholder="Constitutional Foundations" />
                <SubmitButton disabled={selectedSubjectId === null || createMonthMutation.isPending}>
                  Add Month
                </SubmitButton>
              </form>

              <form className="space-y-3" onSubmit={handleCreateWeek}>
                <h3 className="text-sm font-bold text-foreground">Week</h3>
                <label className="space-y-1.5">
                  <span className="text-xs font-semibold text-muted-foreground">Month</span>
                  <select
                    value={selectedMonthId ?? ""}
                    onChange={(event) => setSelectedMonthId(Number(event.target.value) || null)}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none"
                  >
                    <option value="">Select month</option>
                    {createdMonths.map((month) => (
                      <option key={month.id} value={month.id}>
                        Month {month.monthNumber}: {month.title}
                      </option>
                    ))}
                  </select>
                </label>
                <Field label="Week Number" name="weekNumber" type="number" min={1} placeholder="1" />
                <Field label="Title" name="title" placeholder="Preamble and Basics" />
                <SubmitButton disabled={selectedMonthId === null || createWeekMutation.isPending}>
                  Add Week
                </SubmitButton>
              </form>

              <form className="space-y-3" onSubmit={handleCreateDayTopic}>
                <h3 className="text-sm font-bold text-foreground">Day Topic</h3>
                <label className="space-y-1.5">
                  <span className="text-xs font-semibold text-muted-foreground">Week</span>
                  <select
                    value={selectedWeekId ?? ""}
                    onChange={(event) => setSelectedWeekId(Number(event.target.value) || null)}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none"
                  >
                    <option value="">Select week</option>
                    {createdWeeks.map((week) => (
                      <option key={week.id} value={week.id}>
                        Week {week.weekNumber}: {week.title}
                      </option>
                    ))}
                  </select>
                </label>
                <Field label="Day Number" name="dayNumber" type="number" min={1} placeholder="1" />
                <Field label="Title" name="title" placeholder="Preamble and Constitutional Philosophy" />
                <TextArea label="Description" name="description" placeholder="Reading, notes, and practice task." />
                <Field label="Estimated Minutes" name="estimatedMinutes" type="number" min={1} placeholder="90" />
                <SubmitButton disabled={selectedWeekId === null || createDayTopicMutation.isPending}>
                  Add Topic
                </SubmitButton>
              </form>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <div className="rounded-lg border border-border bg-background p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Created months</p>
                <p className="mt-1 text-2xl font-bold" style={{ color: NAVY }}>{createdMonths.length}</p>
              </div>
              <div className="rounded-lg border border-border bg-background p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Created weeks</p>
                <p className="mt-1 text-2xl font-bold" style={{ color: NAVY }}>{createdWeeks.length}</p>
              </div>
              <div className="rounded-lg border border-border bg-background p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Created topics</p>
                <p className="mt-1 text-2xl font-bold" style={{ color: NAVY }}>{createdDayTopics.length}</p>
              </div>
            </div>
          </Panel>

          <div className="grid gap-5 xl:grid-cols-2">
            <Panel title="Courses" icon={CalendarDays}>
              <form className="space-y-3" onSubmit={handleCreateCourse}>
                <Field label="Title" name="title" placeholder="UPSC One Year Foundation" />
                <TextArea label="Description" name="description" placeholder="Complete structured UPSC course." />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Duration Months" name="durationMonths" type="number" min={1} placeholder="12" />
                  <Field label="Price" name="price" type="number" min={0} placeholder="25000" />
                </div>
                <SubmitButton disabled={selectedProgramId === null || createCourseMutation.isPending}>
                  Create Course
                </SubmitButton>
              </form>

              <div className="mt-5 space-y-2">
                {coursesQuery.isLoading ? (
                  <div className="h-20 animate-pulse rounded-lg bg-muted" />
                ) : courses.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No courses in this program yet.</p>
                ) : (
                  courses.map((course) => (
                    <button
                      key={course.id}
                      type="button"
                      onClick={() => setSelectedCourseId(course.id)}
                      className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                        selectedCourseId === course.id
                          ? "border-secondary bg-secondary/10"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      <span className="block font-semibold text-foreground">{course.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {course.durationMonths} months - Rs {course.price.toLocaleString("en-IN")} - {course.subjectCount} subjects
                      </span>
                    </button>
                  ))
                )}
              </div>
            </Panel>

            <Panel title="Attach Subjects" icon={Link2}>
              <div className="mb-4 rounded-lg border border-border bg-background px-3 py-2 text-sm">
                <span className="font-semibold text-foreground">Selected course:</span>{" "}
                <span className="text-muted-foreground">{selectedCourse?.title ?? "None"}</span>
              </div>

              <form className="space-y-3" onSubmit={handleAttachSubject}>
                <label className="space-y-1.5">
                  <span className="text-xs font-semibold text-muted-foreground">Subject</span>
                  <select
                    name="subjectId"
                    required
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none"
                  >
                    <option value="">Select subject</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Display Order" name="displayOrder" type="number" min={1} placeholder="1" />
                  <Field label="Start Month" name="startMonth" type="number" min={1} placeholder="1" />
                </div>
                <SubmitButton disabled={selectedCourseId === null || subjects.length === 0 || attachSubjectMutation.isPending}>
                  Attach Subject
                </SubmitButton>
              </form>

              <div className="mt-5 space-y-2">
                {courseDetailsQuery.isLoading ? (
                  <div className="h-20 animate-pulse rounded-lg bg-muted" />
                ) : courseDetailsQuery.data?.subjects.length ? (
                  courseDetailsQuery.data.subjects.map((subject) => (
                    <div key={`${subject.subjectId}-${subject.displayOrder}`} className="rounded-lg border border-border bg-background p-3">
                      <p className="text-sm font-semibold text-foreground">{subject.subjectName}</p>
                      <p className="text-xs text-muted-foreground">
                        Order {subject.displayOrder} - starts month {subject.startMonth}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No subjects attached to this course yet.</p>
                )}
              </div>
            </Panel>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-2 w-2 rounded-full" style={{ background: TEAL }} />
              <p className="text-sm text-muted-foreground">
                Curriculum month/week/topic lists are kept in this session after creation. A backend curriculum details endpoint is still needed to reload the full tree after refresh.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
