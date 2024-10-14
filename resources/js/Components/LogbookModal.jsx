import React from 'react';
import { useForm } from "@inertiajs/react";
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

const LogbookModal = ({ isOpen, onClose, initialData = {} }) => {
    const { data, setData, post, put, processing, errors } = useForm({
        tanggal: initialData?.tanggal || '',
        catatan: initialData?.catatan || '',
        keterangan: initialData?.keterangan || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (initialData?.id) {
            put(route('logbooks.update', initialData.id), {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => onClose(),
            });
        } else {
            post(route('logbooks.store'), {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => onClose(),
            });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={initialData?.id ? "Edit Catatan Kegiatan (KKL)" : "Tambah Catatan Kegiatan (KKL)"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="tanggal" value="Masukkan Tanggal:" />
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
                    <InputLabel htmlFor="catatan" value="Catatan Kegiatan:" />
                    <TextInput
                        id="catatan"
                        type="textarea"
                        value={data.catatan}
                        onChange={e => setData('catatan', e.target.value)}
                        error={errors.catatan}
                        required
                    />
                    <InputError message={errors.catatan} />
                </div>
                <div>
                    <InputLabel htmlFor="keterangan" value="Keterangan Kegiatan:" />
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
                    <SecondaryButton onClick={onClose}>Close</SecondaryButton>
                    <PrimaryButton type="submit" disabled={processing}>
                        {processing ? 'Saving...' : 'Save'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
};

export default LogbookModal;
