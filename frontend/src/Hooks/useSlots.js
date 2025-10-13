import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { CreateSlotsApi, DeleteSlotApi, FetchSlotsApi, UpdateSlotApi } from '../api/appointmentApi';
import ErrorHandler from '../Components/Layouts/ErrorHandler';

const PAGE_SIZE = 6;

export const useSlots = () => {
    const [slots, setSlots] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters,setFilters] = useState({})

  
    const fetchSlots = async (page,newFilters = filters ) => {
        try {
            setIsLoading(true);
            setCurrentPage(page)
            const data = await FetchSlotsApi(page,newFilters);
            setSlots(data.results);
            setFilters(newFilters)
            setTotalPages(Math.ceil(data.count / PAGE_SIZE));

        } catch (error) {
            ErrorHandler(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSlots(currentPage,filters);
    }, [currentPage,filters]);

    const addSlots = async (slotData, selectedDates) => {
        setIsLoading(true);
        try {
            for (const date of selectedDates) {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const formattedDate = `${year}-${month}-${day}`;
                
                const data = {
                    ...slotData,
                    date: formattedDate,
                };
                await CreateSlotsApi(data);
            }
            toast.success(`Slots created for ${selectedDates.length} date(s)!`);
            fetchSlots(1); 
            setCurrentPage(1);
            return true; 
        } catch (error) {
            ErrorHandler(error);
            return false; 
        } finally {
            setIsLoading(false);
        }
    };

    const updateSlot = async (slotId, slotData) => {
        setIsLoading(true);
        try {
            await UpdateSlotApi(slotId, slotData);
            toast.success("Slot updated successfully!");
            fetchSlots(currentPage); 
            return true;
        } catch (error) {
            ErrorHandler(error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteSlot = async (slotId) => {
        setIsLoading(true);
        try {
            const data = await DeleteSlotApi(slotId);
            toast.success(data.message);
            if (slots.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            } else {
                fetchSlots(currentPage);
            }
            return true;
        } catch (error) {
            ErrorHandler(error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        slots,
        isLoading,
        currentPage,
        totalPages,
        setCurrentPage,
        addSlots,
        updateSlot,
        deleteSlot,
        fetchSlots
    };
};