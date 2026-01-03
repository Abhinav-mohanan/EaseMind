import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DownloadPrescriptionPdfApi, GetUserPrescriptionApi } from "../../../api/prescriptionApi";
import ErrorHandler from "../../../Components/Layouts/ErrorHandler";
import Loading from "../../../Components/Layouts/Loading";
import Navbar from "../../../Components/Users/Common/Navbar";
import { ArrowLeft, FileText, User, Calendar, Clock } from "lucide-react";
import UserSidebar from "../../../Components/Users/User/UserSidebar";
import Breadcrumbs from "../../../Components/Layouts/Breadcrumbs";
import { toast } from "react-toastify";

const UserPrescription = () => {
  const { appointment_id } = useParams();

  const [prescription, setPrescription] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPrescription = async () => {
    setIsLoading(true);
    try {
      const data = await GetUserPrescriptionApi(appointment_id);
      if (data?.type === 'info'){
        toast.info(data.message)
        setPrescription(null)
      }
      if (data?.id) {
        setPrescription(data);
      }
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescription();
  }, [appointment_id]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-Us", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString("en-Us", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const downloadPrescriptionPdf = async(id) =>{
    try{
      const fileBlob = await DownloadPrescriptionPdfApi(id);
      
      const url = window.URL.createObjectURL(new Blob([fileBlob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute('download',`prescription_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }catch(error){
      ErrorHandler(error)
    }
  }

  const breadcrumbItems = [
    {label:'Prescriptions',link:'/user/consultations'},
    {label:'Detail',link:null}
  ]

  return (
    <Loading isLoading={isLoading}>
      <div className="min-h-screen bg-gray-50 pt-16">
          <Navbar />
        <div className="flex-1 lg:ml-64">
        <UserSidebar />
          <div className="p-6 max-w-5xl mx-auto">
            <Breadcrumbs items={breadcrumbItems}/>
            <div className="flex items-center mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  My Prescription
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  View details of your consultation prescription
                </p>
              </div>
            </div>

            {!prescription ? (
              <div className="text-center py-6">
                <div className="mb-4">
                  <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-teal-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Prescription Available
                  </h3>
                  <p className="text-gray-500">
                    Your psychologist has not added a prescription yet.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900 flex items-center">
                      <User className="h-5 w-5 mr-2 text-blue-600" />
                      Appointment Information
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500"> Name</p>
                          <p className="font-medium text-gray-900">
                            {prescription.appointment?.user_name || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <Calendar className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Appointment Date</p>
                          <p className="font-medium text-gray-900">
                            {formatDate(prescription.appointment?.slot_date)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="bg-purple-100 p-2 rounded-lg">
                          <Clock className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Appointment Time</p>
                          <p className="font-medium text-gray-900">
                            {formatTime(prescription.appointment?.slot_time)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900 flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-teal-600" />
                      Prescription Details
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Diagnosis</label>
                          <div className="bg-gray-50 p-3 rounded-lg border">
                            <p className="text-gray-900">{prescription.diagnosis || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Severity Level</label>
                          <div className="bg-gray-50 p-3 rounded-lg border">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                              prescription.severity_level === 'severe' ? 'bg-red-100 text-red-800' :
                              prescription.severity_level === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                              prescription.severity_level === 'mild' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {prescription.severity_level || 'Not specified'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Medicines</label>
                        <div className="bg-gray-50 p-3 rounded-lg border">
                          <p className="text-gray-900 whitespace-pre-wrap">{prescription.medicines || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Advice & Recommendations</label>
                        <div className="bg-gray-50 p-3 rounded-lg border">
                          <p className="text-gray-900 whitespace-pre-wrap">{prescription.advice || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Follow-up Date</label>
                          <div className="bg-gray-50 p-3 rounded-lg border">
                            <p className="text-gray-900">{formatDate(prescription.follow_up_date)}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Prescription Date</label>
                          <div className="bg-gray-50 p-3 rounded-lg border">
                            <p className="text-gray-900">{formatDate(prescription.created_at)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                  onClick={() => downloadPrescriptionPdf(prescription?.appointment?.id)}
                  className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition"
                  >
                   <FileText className="h-5 w-5 mr-2" />
                    Download PDF
                    </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Loading>
  );
};

export default UserPrescription;