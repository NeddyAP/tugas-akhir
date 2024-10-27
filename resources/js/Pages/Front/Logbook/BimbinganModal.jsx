import React from 'react';
import { useForm } from "@inertiajs/react";
import Modal from '@/Components/Front/Modal';
import InputLabel from '@/Components/Front/InputLabel';
import InputError from '@/Components/Front/InputError';
import TextInput from '@/Components/Front/TextInput';
import PrimaryButton from '@/Components/Front/PrimaryButton';
import SecondaryButton from '@/Components/Front/SecondaryButton';

const BimbinganModal = ({ isOpen, onClose, onSubmit }) => {
    const { data, setData, post, processing, errors } = useForm({
        tanggal: '',
        keterangan: '',
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
                    <InputLabel htmlFor="tanggal" value="Tanggal Bimbingan:" />
                    <TextInput
                        id="tanggal"
                        type="date"
                        value={data.tanggal}
                        onChange={e => setData('tanggal', e.target.value)}
                        error={errors.tanggal}
                        required
                    />
                    <InputError message={errors.tanggal} />
                </div>
                <div>
                    <InputLabel htmlFor="keterangan" value="Keterangan Bimbingan:" />
                    <TextInput
                        id="keterangan"
                        type="textarea"
                        value={data.keterangan}
                        onChange={e => setData('keterangan', e.target.value)}
                        error={errors.keterangan}
                        required
                    />
                    <InputError message={errors.keterangan} />
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