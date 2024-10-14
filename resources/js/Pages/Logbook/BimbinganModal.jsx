import React from 'react';
import { useForm } from "@inertiajs/react";
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

const BimbinganModal = ({ isOpen, onClose, onSubmit }) => {
    const { data, setData, post, processing, errors } = useForm({
        tanggalBimbingan: '',
        keteranganBimbingan: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('bimbingans.store'), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                onClose();
                onSubmit();
            },
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Laporan Bimbingan">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="tanggalBimbingan" value="Tanggal Bimbingan:" />
                    <TextInput
                        id="tanggalBimbingan"
                        type="date"
                        value={data.tanggalBimbingan}
                        onChange={e => setData('tanggalBimbingan', e.target.value)}
                        error={errors.tanggalBimbingan}
                        required
                    />
                    <InputError message={errors.tanggalBimbingan} />
                </div>
                <div>
                    <InputLabel htmlFor="keteranganBimbingan" value="Keterangan Bimbingan:" />
                    <TextInput
                        id="keteranganBimbingan"
                        type="textarea"
                        value={data.keteranganBimbingan}
                        onChange={e => setData('keteranganBimbingan', e.target.value)}
                        error={errors.keteranganBimbingan}
                        required
                    />
                    <InputError message={errors.keteranganBimbingan} />
                </div>
                <div className="flex justify-end space-x-2">
                    <SecondaryButton onClick={onClose}>Review</SecondaryButton>
                    <PrimaryButton type="submit" disabled={processing}>
                        {processing ? 'Sending...' : 'Send'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
};

export default BimbinganModal;