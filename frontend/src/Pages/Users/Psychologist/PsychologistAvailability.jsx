import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../../../Components/Users/Navbar';
import PsychologistSidebar from '../../../Components/Users/Psychologist/PsychologistSidebar';
import Loading from '../../../Components/Layouts/Loading';
import Pagination from '../../../Components/Layouts/Pagination';
import ConfirmationModal from '../../../Components/Layouts/Confirmationmodal';
import SlotForm from '../../../Components/Users/Psychologist/slotForm';
import SlotList from '../../../Components/Users/Psychologist/SlotList';
import { useSlots } from '../../../Hooks/UseSlots';

const PsychologistAvailability = () => {
    const {
        slots,
        isLoading,
        currentPage,
        totalPages,
        setCurrentPage,
        addSlots,
        updateSlot,
        deleteSlot,
        fetchSlots
    } = useSlots();

    const [editingSlot, setEditingSlot] = useState(null); 
    const [slotToDelete, setSlotToDelete] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleEditClick = (slot) => {
        if (slot.is_booked) {
            toast.error("Cannot edit a booked slot.");
            return;
        }
        setEditingSlot(slot);
        window.scrollTo(0, 0);  
    }

    const handleCancelEdit = () => {
        setEditingSlot(null);
    }

    const handleDeleteClick = (slotId) => {
        setSlotToDelete(slotId);
        setIsModalOpen(true);
    }

    const confirmDelete = async () => {
        if (!slotToDelete) return;
        const success = await deleteSlot(slotToDelete);
        if (success) {
            setIsModalOpen(false);
            setSlotToDelete(null);
        }
    }

    const onCloseModal = () => {
        setIsModalOpen(false);
        setSlotToDelete(null);
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50 pt-16">
                <PsychologistSidebar />
                <div className="ml-0 lg:ml-64 transition-all duration-300">
                    <Navbar />
                    <main className="flex-1 p-8">
                        <div className="max-w-5xl mx-auto">
                            <SlotForm
                                onSubmit={addSlots}
                                onUpdate={updateSlot}
                                onCancelEdit={handleCancelEdit}
                                isEditMode={!!editingSlot}
                                editingSlot={editingSlot} />
                            <SlotList
                                slots={slots}
                                onEdit={handleEditClick}
                                onDelete={handleDeleteClick}
                                fetchSlots={fetchSlots}
                                setCurrentPage={setCurrentPage}
                                currentPage={currentPage}/>
                            {totalPages > 1 && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage} />
                            )}
                        </div>
                    </main>
                </div>
            </div>
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={onCloseModal}
                onConfirm={confirmDelete}
                title='Delete Slot'
                message='Are you sure you want to delete this slot? This action cannot be undone.'
                confirmText='Delete'
                cancelText='Cancel'
            />
            </>
    );
};

export default PsychologistAvailability;