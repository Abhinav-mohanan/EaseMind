import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FetchPsychologistDetail,
  FetchUserDetail,
  PsychologistProfileApi,
  UserProfileApi,
} from '../../../api/authApi';
import ErrorHandler from '../../../Components/Layouts/ErrorHandler';
import { toast } from 'react-toastify';
import Navbar from '../../../Components/Users/Navbar';
import PsychologistSidebar from '../../../Components/Users/Psychologist/PsychologistSidebar';
import { CheckCircle } from 'lucide-react';

const PsychologistProfile = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [personalData, setPersonalData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    gender: '',
    date_of_birth: '',
    profile_picture: '',
  });

  const [professionalData, setProfessionalData] = useState({
    bio: '',
    education: '',
    license_no: '',
    specialization: '',
    experience_years: '',
    license_certificate: null,
    experience_certificate: null,
    education_certificate: null,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [initialPersonalData, setInitialPersonalData] = useState(null);
  const [initialProfessionalData, setInitialProfessionalData] = useState(null);
  const [role, setRole] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isVerified, setIsVerified] = useState('pending');
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateProgress = (personal, professional) => {
    const personalFields = ['first_name', 'last_name', 'phone_number', 'gender', 'date_of_birth'];
    const professionalFields = [
      'license_no',
      'specialization',
      'experience_years',
      'license_certificate',
      'experience_certificate',
      'education_certificate',
      'education',
      'bio',
    ];
    const filledPersonal = personalFields.filter((field) => personal[field]).length;
    const filledProfessional = professionalFields.filter((field) => professional[field]).length;
    const totalFields = personalFields.length + professionalFields.length;
    const filledFields = filledPersonal + filledProfessional;
    return Math.round((filledFields / totalFields) * 100);
  };

  const fetchProfile = async () => {
    try {
      const [userData, psychData] = await Promise.all([
        FetchUserDetail(),
        FetchPsychologistDetail(),
      ]);

      const personal = {
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        email: userData.email || '',
        phone_number: userData.phone_number || '',
        gender: userData.gender || '',
        date_of_birth: userData.date_of_birth || '',
        profile_picture: userData.profile_picture,
      };

      const professional = {
        education: psychData.education || '',
        bio: psychData.bio || '',
        license_no: psychData.license_no || '',
        specialization: psychData.specialization || '',
        experience_years: psychData.experience_years || '',
        license_certificate: psychData.license_certificate || null,
        experience_certificate: psychData.experience_certificate || null,
        education_certificate: psychData.education_certificate || null,
      };
      setPersonalData(personal);
      setProfessionalData(professional);
      setInitialPersonalData(personal);
      setInitialProfessionalData(professional);
      setRole(userData.role);
      setIsVerified(psychData.is_verified || 'pending');
      setProgress(calculateProgress(personal, professional));
      setImagePreview(personal.profile_picture);
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (role && role !== 'psychologist') {
      toast.error('Access denied. This page for psychologists only');
      navigate('/');
    }
  }, [role, navigate]);

  const handlePersonalChange = (e) => {
    const updatedPersonalData = { ...personalData, [e.target.name]: e.target.value };
    setPersonalData(updatedPersonalData);
    setProgress(calculateProgress(updatedPersonalData, professionalData));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPersonalData({ ...personalData, profile_picture: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfessionalChange = (e) => {
    const { name, value, files } = e.target;
    const updatedProfessionalData = files
      ? { ...professionalData, [name]: files[0] }
      : { ...professionalData, [name]: value };
    setProfessionalData(updatedProfessionalData);
    setProgress(calculateProgress(personalData, updatedProfessionalData));
  };

  const handleCancel = () => {
    setPersonalData(initialPersonalData);
    setProfessionalData(initialProfessionalData);
    setProgress(calculateProgress(initialPersonalData, initialProfessionalData));
    setImagePreview(initialPersonalData.profile_picture);
    setIsEditing(false);
    setCurrentStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    Object.keys(professionalData).forEach((key) => {
      if (professionalData[key]) {
        formData.append(key, professionalData[key]);
      }
    });

    const personalFormData = new FormData();
    for (const key in personalData) {
      if (personalData[key] !== null && formData[key] !== '') {
        personalFormData.append(key, personalData[key]);
      }
    }

    try {
      await Promise.all([UserProfileApi(personalFormData), PsychologistProfileApi(formData)]);
      setInitialPersonalData(personalData);
      setInitialProfessionalData(professionalData);
      setIsEditing(false);
      setCurrentStep(1);
      toast.success('Profile Submited for verification');
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = () => {
    const firstName = personalData.first_name || '';
    const lastName = personalData.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getFullName = () => {
    const firstName = personalData.first_name || '';
    const lastName = personalData.last_name || '';
    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    }
    return 'Psychologist Profile';
  };

  const nextStep = () => {
    setCurrentStep(2);
  };

  const prevStep = () => {
    setCurrentStep(1);
  };

  const isPersonalDataComplete = () => {
    return (
      personalData.first_name &&
      personalData.last_name &&
      personalData.phone_number &&
      personalData.gender &&
      personalData.date_of_birth
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-1">
          <div className="flex-1 p-8 bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg font-medium">Loading your profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <PsychologistSidebar />
      <div className="ml-0 lg:ml-64 transition-all duration-300">
        <Navbar />
        <div className="p-4 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Profile Header */}
            <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-teal-600 to-teal-700 h-32 relative">
                <div className="absolute -bottom-16 left-8">
                  <div className="relative">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile"
                        className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-teal-600 to-teal-700 flex items-center justify-center">
                        <span className="text-white text-3xl font-bold">{getInitials()}</span>
                      </div>
                    )}
                    {isEditing && currentStep === 1 && (
                      <label className="absolute bottom-0 right-0 bg-teal-600 text-white rounded-full p-2 cursor-pointer hover:bg-teal-700 transition-colors">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
              <div className="pt-20 pb-6 px-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{getFullName()}</h1>
                    <p className="text-gray-600 flex items-center mb-2">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        />
                      </svg>
                      {personalData.email}
                    </p>
                    {isVerified === 'pending' && (
                      <div className="flex items-center text-yellow-600">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Profile pending verification
                      </div>
                    )}
                    {isVerified === 'rejected' && (
                      <div className="flex items-center text-red-600">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                          />
                        </svg>
                        Profile was rejected
                      </div>
                    )}
                    {isVerified === 'verified' && (
                      <div className="flex items-center text-green-600">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Profile verified
                      </div>
                    )}
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200 flex items-center space-x-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      <span>Edit Profile</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Profile Completion: {progress}%
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">Complete your profile</p>
                </div>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-white shadow-lg rounded-xl p-8">
              {/* Step Navigation */}
              {isEditing && (
                <div className="flex items-center justify-center mb-8">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`flex items-center space-x-2 ${currentStep === 1 ? 'text-teal-600' : 'text-gray-400'}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 1 ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}
                      >
                        1
                      </div>
                      <span className="font-medium">Personal Details</span>
                    </div>
                    <div className="w-16 h-px bg-gray-300"></div>
                    <div
                      className={`flex items-center space-x-2 ${currentStep === 2 ? 'text-teal-600' : 'text-gray-400'}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 2 ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}
                      >
                        2
                      </div>
                      <span className="font-medium">Professional Details</span>
                    </div>
                  </div>
                </div>
              )}

              {!isEditing ? (
                <div className="space-y-8">
                  {/* Personal Details Display */}
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                      <svg
                        className="w-6 h-6 mr-3 text-teal-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Personal Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <div className="border-l-4 border-teal-500 pl-4">
                          <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            First Name
                          </label>
                          <p className="text-lg text-gray-900 mt-1">
                            {personalData.first_name || 'Not provided'}
                          </p>
                        </div>
                        <div className="border-l-4 border-teal-500 pl-4">
                          <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            Last Name
                          </label>
                          <p className="text-lg text-gray-900 mt-1">
                            {personalData.last_name || 'Not provided'}
                          </p>
                        </div>
                        <div className="border-l-4 border-teal-500 pl-4">
                          <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            Phone Number
                          </label>
                          <p className="text-lg text-gray-900 mt-1">
                            {personalData.phone_number || 'Not provided'}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div className="border-l-4 border-teal-600 pl-4">
                          <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            Gender
                          </label>
                          <p className="text-lg text-gray-900 mt-1">
                            {personalData.gender || 'Not provided'}
                          </p>
                        </div>
                        <div className="border-l-4 border-teal-600 pl-4">
                          <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            Date of Birth
                          </label>
                          <p className="text-lg text-gray-900 mt-1">
                            {personalData.date_of_birth || 'Not provided'}
                          </p>
                        </div>
                        <div className="border-l-4 border-teal-600 pl-4">
                          <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            Email Address
                          </label>
                          <p className="text-lg text-gray-900 mt-1">{personalData.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Professional Details Display */}
                  <div className="border-t pt-8">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                      <svg
                        className="w-6 h-6 mr-3 text-teal-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      Professional Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <div className="border-l-4 border-teal-600 pl-4">
                          <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            Bio
                          </label>
                          <p className="text-lg text-gray-900 mt-1 max-h-30 overflow-y-auto pr-2">
                            {professionalData.bio || 'Not provided'}
                          </p>
                        </div>
                        <div className="border-l-4 border-teal-600 pl-4">
                          <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            Education
                          </label>
                          <p className="text-lg text-gray-900 mt-1">
                            {professionalData.education || 'Not provided'}
                          </p>
                        </div>
                        <div className="border-l-4 border-teal-600 pl-4">
                          <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            Specialization
                          </label>
                          <p className="text-lg text-gray-900 mt-1">
                            {professionalData.specialization || 'Not provided'}
                          </p>
                        </div>
                        <div className="border-l-4 border-teal-600 pl-4">
                          <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            Years of Experience
                          </label>
                          <p className="text-lg text-gray-900 mt-1">
                            {professionalData.experience_years || 'Not provided'}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div className="border-l-4 border-teal-500 pl-4">
                          <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            License Number
                          </label>
                          <p className="text-lg text-gray-900 mt-1">
                            {professionalData.license_no || 'Not provided'}
                          </p>
                        </div>
                        <div className="border-l-4 border-teal-500 pl-4">
                          <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            License Certificate
                          </label>
                          {professionalData.license_certificate ? (
                            <a
                              href={professionalData.license_certificate}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-teal-600 hover:text-teal-700 flex items-center mt-1"
                            >
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 0116 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                              View Certificate
                            </a>
                          ) : (
                            <p className="text-lg text-gray-900 mt-1">Not provided</p>
                          )}
                        </div>
                        <div className="border-l-4 border-teal-500 pl-4">
                          <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            Experience Certificate
                          </label>
                          {professionalData.experience_certificate ? (
                            <a
                              href={professionalData.experience_certificate}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-teal-600 hover:text-teal-700 flex items-center mt-1"
                            >
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                              View Certificate
                            </a>
                          ) : (
                            <p className="text-lg text-gray-900 mt-1">Not provided</p>
                          )}
                        </div>
                        <div className="border-l-4 border-teal-500 pl-4">
                          <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            Education Certificate
                          </label>
                          {professionalData.education_certificate ? (
                            <a
                              href={professionalData.education_certificate}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-teal-600 hover:text-teal-700 flex items-center mt-1"
                            >
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                              View Certificate
                            </a>
                          ) : (
                            <p className="text-lg text-gray-900 mt-1">Not provided</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {/* Step 1: Personal Details */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                        <svg
                          className="w-6 h-6 mr-3 text-teal-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Personal Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name
                          </label>
                          <input
                            type="text"
                            name="first_name"
                            value={personalData.first_name}
                            onChange={handlePersonalChange}
                            className="w-full p-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200"
                            placeholder="Enter your first name"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name
                          </label>
                          <input
                            type="text"
                            name="last_name"
                            value={personalData.last_name}
                            onChange={handlePersonalChange}
                            className="w-full p-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200"
                            placeholder="Enter your last name"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phone_number"
                            value={personalData.phone_number}
                            onChange={handlePersonalChange}
                            className="w-full p-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200"
                            placeholder="Enter your phone number"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Gender
                          </label>
                          <select
                            name="gender"
                            value={personalData.gender}
                            onChange={handlePersonalChange}
                            className="w-full p-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200"
                            required
                          >
                            <option value="" disabled>
                              Select Gender
                            </option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date of Birth
                          </label>
                          <input
                            type="date"
                            name="date_of_birth"
                            value={personalData.date_of_birth}
                            onChange={handlePersonalChange}
                            className="w-full p-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={personalData.email}
                            onChange={handlePersonalChange}
                            className="w-full p-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200"
                            placeholder="Enter your email"
                            disabled
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-4 mt-8">
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={nextStep}
                          disabled={!isPersonalDataComplete()}
                          className={`px-6 py-3 rounded-lg transition-colors duration-200 ${
                            isPersonalDataComplete()
                              ? 'bg-teal-600 text-white hover:bg-teal-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Professional Details */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                        <svg
                          className="w-6 h-6 mr-3 text-teal-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                        Professional Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bio
                          </label>
                          <textarea
                            type="text"
                            name="bio"
                            rows={4}
                            value={professionalData.bio}
                            onChange={handleProfessionalChange}
                            className="w-full p-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200 resize-none"
                            placeholder="Enter your Bio"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Education
                          </label>
                          <input
                            type="text"
                            name="education"
                            value={professionalData.education}
                            onChange={handleProfessionalChange}
                            className="w-full p-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200"
                            placeholder="Enter your Education"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            License Number
                          </label>
                          <input
                            type="text"
                            name="license_no"
                            value={professionalData.license_no}
                            onChange={handleProfessionalChange}
                            className="w-full p-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200"
                            placeholder="Enter your license number"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Specialization
                          </label>
                          <input
                            type="text"
                            name="specialization"
                            value={professionalData.specialization}
                            onChange={handleProfessionalChange}
                            className="w-full p-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200"
                            placeholder="Enter your specialization"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Years of Experience
                          </label>
                          <input
                            type="number"
                            name="experience_years"
                            value={professionalData.experience_years}
                            onChange={handleProfessionalChange}
                            className="w-full p-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200"
                            placeholder="Enter years of experience"
                            min="0"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            License Certificate
                          </label>
                          <input
                            type="file"
                            name="license_certificate"
                            onChange={handleProfessionalChange}
                            className="w-full p-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200"
                            accept=".pdf,.jpg,.jpeg,.png"
                          />
                          {professionalData.license_certificate && (
                            <p className="text-sm text-gray-500 mt-2">
                              Selected:{' '}
                              {professionalData.license_certificate.name || 'File uploaded'}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Experience Certificate
                          </label>
                          <input
                            type="file"
                            name="experience_certificate"
                            onChange={handleProfessionalChange}
                            className="w-full p-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200"
                            accept=".pdf,.jpg,.jpeg,.png"
                          />
                          {professionalData.experience_certificate && (
                            <p className="text-sm text-gray-500 mt-2">
                              Selected:{' '}
                              {professionalData.experience_certificate.name || 'File uploaded'}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Education Certificate
                          </label>
                          <input
                            type="file"
                            name="education_certificate"
                            onChange={handleProfessionalChange}
                            className="w-full p-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200"
                            accept=".pdf,.jpg,.jpeg,.png"
                          />
                          {professionalData.education_certificate && (
                            <p className="text-sm text-gray-500 mt-2">
                              Selected:{' '}
                              {professionalData.education_certificate.name || 'File uploaded'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between space-x-4 mt-8">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                        >
                          Previous
                        </button>
                        <div className="flex space-x-4">
                          <button
                            type="button"
                            onClick={handleCancel}
                            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-6 py-3 rounded-lg transition-colors duration-200 ${
                              isSubmitting
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-teal-600 text-white hover:bg-teal-700'
                            }`}
                          >
                            {isVerified === 'rejected'? 'Resubmit':isSubmitting ? 'Submitting...' : 'Submit'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PsychologistProfile;
