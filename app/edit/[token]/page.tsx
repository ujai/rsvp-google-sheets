import { notFound, redirect } from "next/navigation";
import { fetchRSVPForEdit } from "@/app/actions/rsvp";
import { EditRSVPForm } from "@/components/client/edit-rsvp-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EVENT_DETAILS } from "@/lib/constants";
import { isDeadlinePassed } from "@/lib/helpers";

interface EditPageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function EditPage({ params }: EditPageProps) {
  const { token } = await params;

  // Check if deadline has passed
  if (isDeadlinePassed()) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-baby-blue-light">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold text-baby-blue-dark">
              RSVP Telah Ditutup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-baby-blue-dark">
              Tempoh untuk mengemaskini RSVP telah tamat. Jika anda mempunyai sebarang pertanyaan,
              sila hubungi penganjur majlis.
            </p>
            <div className="text-center pt-4">
              <a
                href="/"
                className="text-baby-blue hover:text-baby-blue-dark underline font-medium"
              >
                Kembali ke halaman utama
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fetch existing RSVP data
  const result = await fetchRSVPForEdit(token);

  if (!result.success || !result.data) {
    notFound();
  }

  const handleSuccess = async () => {
    "use server";
    redirect(`/edit/${token}/success`);
  };

  return (
    <div className="min-h-screen bg-cream py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-baby-blue-dark mb-2">
            {EVENT_DETAILS.title}
          </h1>
          <p className="text-lg text-baby-blue-dark">
            Untuk {EVENT_DETAILS.babyName}
          </p>
        </div>

        {/* Edit Form Card */}
        <Card className="border-baby-blue-light shadow-lg">
          <CardHeader className="border-b border-baby-blue-light/30 bg-baby-blue/5">
            <CardTitle className="text-2xl font-semibold text-baby-blue-dark text-center">
              Kemaskini RSVP Anda
            </CardTitle>
            <p className="text-sm text-baby-blue-dark text-center mt-2">
              Anda boleh mengemaskini nama dan bilangan orang yang akan hadir
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <EditRSVPForm
              token={token}
              initialData={result.data}
              onSuccess={handleSuccess}
            />
          </CardContent>
        </Card>

        {/* Back Link */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-baby-blue hover:text-baby-blue-dark underline font-medium"
          >
            Kembali ke halaman utama
          </a>
        </div>
      </div>
    </div>
  );
}
