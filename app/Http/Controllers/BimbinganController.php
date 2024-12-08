<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Http\Requests\BimbinganRequest;
use App\Http\Traits\ResponseTrait;
use App\Models\Bimbingan;
use App\Services\BimbinganService;
use Illuminate\Http\RedirectResponse;

class BimbinganController extends Controller
{
    use AuthorizesRequests, ResponseTrait;

    public function __construct(
        protected BimbinganService $bimbinganService
    ) {}

    public function store(BimbinganRequest $request): RedirectResponse
    {
        $this->bimbinganService->create($request->validated());

        return $this->flashResponse('Data bimbingan baru berhasil ditambahkan.');
    }

    public function update(BimbinganRequest $request, Bimbingan $bimbingan): RedirectResponse
    {
        $this->authorize('update', $bimbingan);

        $this->bimbinganService->update($bimbingan, $request->validated());

        return $this->flashResponse('Data bimbingan berhasil diubah.');
    }

    public function destroy(Bimbingan $bimbingan): RedirectResponse
    {
        $this->authorize('delete', $bimbingan);

        $this->bimbinganService->delete($bimbingan);

        return $this->flashResponse('Data bimbingan berhasil dihapus.');
    }
}
