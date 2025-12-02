import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CreatePsychologistPrescriptionApi, DownloadPrescriptionPdfApi, GetPsychologistPrescriptionApi, UpdatePsychologistPrescriptionApi } from '../../../api/prescriptionApi'
import ErrorHandler from '../../../Components/Layouts/ErrorHandler'
import Loading from '../../../Components/Layouts/Loading';
import PsychologistSidebar from '../../../Components/Users/Psychologist/PsychologistSidebar';
import Navbar from '../../../Components/Users/Common/Navbar';
import { ArrowLeft, Edit, FileText, Save, User, Calendar, Clock, Plus, Eye } from 'lucide-react';

const PsychologistPrescription = () => {
    const { appointment_id } = useParams()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        diagnosis: "",
        medicines: "",
        advice: "",
        follow_up_date: "",
        severity_level: "",
    })

    const [prescription, setPrescription] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [formErrors,setFormErrors] = useState({})

    const fetchPrescription = async () => {
        setIsLoading(true)
        try {
            const data = await GetPsychologistPrescriptionApi(appointment_id)
            setPrescription(data)

            if (data.id) {
                setIsEditing(false) 
                setFormData({
                    diagnosis: data.diagnosis || '',
                    medicines: data.medicines || '',
                    advice: data.advice || '',
                    follow_up_date: data.follow_up_date || '',
                    severity_level: data.severity_level || '',
                })
            } else {
                setIsEditing(false)  
                setFormData({
                    diagnosis: '',
                    medicines: '',
                    advice: '',
                    follow_up_date: '',
                    severity_level: '',
                })
            }
        } catch (error) {
            ErrorHandler(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchPrescription()
    }, [appointment_id])

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const validateForm = () =>{
      const errors = {}
      if(!formData.diagnosis.trim()){
        errors.diagnosis = "please fill Diagnosis"
      }
      return errors
    }

    const handleSave = async() => {
      const errors = validateForm()
      if(Object.keys(errors).length > 0){
        setFormErrors(errors)
        return
      }
      setFormErrors({})
      setIsLoading(true)
      try{
        const endpoint = prescription.id
        ?UpdatePsychologistPrescriptionApi
        :CreatePsychologistPrescriptionApi
        const data = await endpoint(appointment_id,formData)
        setIsEditing(false)
        setPrescription(data)
        fetchPrescription()
      }catch(error){
        ErrorHandler(error)
      }finally{
        setIsLoading(false)
      }
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        const date = new Date(dateString)
        return date.toLocaleDateString('en-Us', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })
    }

    const formatTime = (timeString) => {
        if (!timeString) return 'N/A'
        return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-Us', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })
    }

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

    return (
        <Loading isLoading={isLoading}>
            <div className="min-h-screen bg-gray-50 pt-16">
                <PsychologistSidebar />
                <div className="flex-1 lg:ml-64">
                    <Navbar />
                    <div className="p-6 max-w-5xl mx-auto">
                        <div className="flex items-center mb-8">
                            <button
                                onClick={() => navigate('/psychologist/consultations')}
                                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5 text-gray-600" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">Prescription Management</h1>
                                <p className="text-sm text-gray-500 mt-1">Manage patient prescription details</p>
                            </div>
                        </div>

                        {prescription && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                                        <h2 className="text-lg font-medium text-gray-900 flex items-center">
                                            <User className="h-5 w-5 mr-2 text-blue-600" />
                                            Patient Information
                                        </h2>
                                    </div>
                                    <div className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-blue-100 p-2 rounded-lg">
                                                    <User className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Patient Name</p>
                                                    <p className="font-medium text-gray-900">{prescription.appointment?.user_name || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-green-100 p-2 rounded-lg">
                                                    <Calendar className="h-5 w-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Appointment Date</p>
                                                    <p className="font-medium text-gray-900">{formatDate(prescription.appointment?.slot_date)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-purple-100 p-2 rounded-lg">
                                                    <Clock className="h-5 w-5 text-purple-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Appointment Time</p>
                                                    <p className="font-medium text-gray-900">{formatTime(prescription.appointment?.slot_time)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex'>
                                <button
                                onClick={()=>navigate('/psychologist/user/health-status',{state:{userID:prescription.appointment?.user_id}})} 
                                className='font-medium text-gray-600 flex items-center gap-1 ml-auto hover:text-textBlue'>
                                    <Eye className='h-5 w-5 text-customBlue'/>
                                    View user health status
                                </button>
                                </div>
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="bg-gradient-to-r from-teal-50 to-cyan-50 px-6 py-4 border-b border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-lg font-medium text-gray-900 flex items-center">
                                                <FileText className="h-5 w-5 mr-2 text-teal-600" />
                                                Prescription Details
                                            </h2>
                                            {prescription.id && !isEditing && (
                                                <button
                                                    onClick={() => setIsEditing(true)}
                                                    className="flex items-center px-4 py-2 text-sm font-medium text-teal-700 bg-teal-100 hover:bg-teal-200 rounded-lg transition-colors"
                                                >
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Edit
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        {prescription.id && !isEditing ? (
                                            // View Mode
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
                                                    <label className="text-sm font-medium text-gray-700">Advice</label>
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
                                                        <label className="text-sm font-medium text-gray-700">Created At</label>
                                                        <div className="bg-gray-50 p-3 rounded-lg border">
                                                            <p className="text-gray-900">{formatDate(prescription.created_at)}</p>
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
                                        ) : (
                                            <>
                                                {!prescription.id && !isEditing && (
                                                    <div className="text-center py-12">
                                                        <div className="mb-4">
                                                            <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                                                <FileText className="h-8 w-8 text-teal-600" />
                                                            </div>
                                                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Prescription Found</h3>
                                                            <p className="text-gray-500 mb-6">Create a new prescription for this patient</p>
                                                        </div>
                                                        <button
                                                            onClick={() => setIsEditing(true)}
                                                            className="inline-flex items-center px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
                                                        >
                                                            <Plus className="h-5 w-5 mr-2" />
                                                            Add Prescription
                                                        </button>
                                                    </div>
                                                )}

                                                {isEditing && (
                                                    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <div className="md:col-span-2 space-y-2">
                                                            <label className="block text-sm font-medium text-gray-700">
                                                              Diagnosis <span className="text-red-500">*</span>
                                                            </label>
                                                            <textarea
                                                              name="diagnosis"
                                                              value={formData.diagnosis}
                                                              onChange={handleInputChange}
                                                              rows={3}
                                                              className={`w-full px-3 py-3 border rounded-lg focus:ring-2 transition-colors ${
                                                                formErrors.diagnosis
                                                                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                                                  : "border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                                                              }`}
                                                              placeholder="Enter diagnosis details..."
                                                            />
                                                            {formErrors.diagnosis && (
                                                              <p className="text-red-500 text-sm mt-1">{formErrors.diagnosis}</p>
                                                            )}
                                                          </div>
                                                            <div className="space-y-2">
                                                                <label className="block text-sm font-medium text-gray-700">
                                                                    Severity Level
                                                                </label>
                                                                <select
                                                                    name="severity_level"
                                                                    value={formData.severity_level}
                                                                    onChange={handleInputChange}
                                                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                                                                >
                                                                    <option value="">Select severity level</option>
                                                                    <option value="mild">Mild</option>
                                                                    <option value="moderate">Moderate</option>
                                                                    <option value="severe">Severe</option>
                                                                </select>
                                                            </div>

                                                            <div className="space-y-2">
                                                                <label className="block text-sm font-medium text-gray-700">
                                                                    Follow-up Date
                                                                </label>
                                                                <input
                                                                    type="date"
                                                                    name="follow_up_date"
                                                                    value={formData.follow_up_date}
                                                                    onChange={handleInputChange}
                                                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                                                                />
                                                            </div>

                                                            <div className="md:col-span-2 space-y-2">
                                                                <label className="block text-sm font-medium text-gray-700">
                                                                    Medicines 
                                                                </label>
                                                                <textarea
                                                                    name="medicines"
                                                                    value={formData.medicines}
                                                                    onChange={handleInputChange}
                                                                    rows={4}
                                                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                                                                    placeholder="Enter prescribed medicines with dosage..."
                                                                    required
                                                                />
                                                            </div>

                                                            <div className="md:col-span-2 space-y-2">
                                                                <label className="block text-sm font-medium text-gray-700">
                                                                    Advice & Recommendations
                                                                </label>
                                                                <textarea
                                                                    name="advice"
                                                                    value={formData.advice}
                                                                    onChange={handleInputChange}
                                                                    rows={3}
                                                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                                                                    placeholder="Enter advice and recommendations for the patient..."
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setIsEditing(false)
                                                                    if (prescription.id) {
                                                                        setFormData({
                                                                            diagnosis: prescription.diagnosis || '',
                                                                            medicines: prescription.medicines || '',
                                                                            advice: prescription.advice || '',
                                                                            follow_up_date: prescription.follow_up_date || '',
                                                                            severity_level: prescription.severity_level || '',
                                                                        })
                                                                    }
                                                                }}
                                                                className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                type="submit"
                                                                className="inline-flex items-center px-6 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
                                                            >
                                                                <Save className="h-4 w-4 mr-2" />
                                                                {prescription.id ? 'Update Prescription' : 'Save Prescription'}
                                                            </button>
                                                        </div>
                                                    </form>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Loading>
    )
}

export default PsychologistPrescription