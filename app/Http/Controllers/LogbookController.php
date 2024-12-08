<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Http\Requests\LogbookRequest;
use App\Http\Traits\ResponseTrait;
use App\Models\{Logbook, Bimbingan};
use App\Services\{LogbookService, BimbinganService};
use Illuminate\Http\RedirectResponse;
use Inertia\{Response, Inertia};

class LogbookController extends Controller
{
    use AuthorizesRequests, ResponseTrait;

    public function __construct(
        protected LogbookService $logbookService,
        protected BimbinganService $bimbinganService
    ) {}

    public function index(): Response
    {
        $userId = auth()->id();

        return Inertia::render('Front/Logbook/LogbookPage', [
            'logbooks' => $this->logbookService->getUserLogbooks($userId),
            'bimbingans' => $this->bimbinganService->getUserBimbingans($userId),
        ]);
    }

    public function store(LogbookRequest $request): RedirectResponse
    {
        $this->logbookService->create($request->validated());

        return $this->flashResponse('Logbook baru berhasil ditambahkan.');
    }

    public function update(LogbookRequest $request, Logbook $logbook): RedirectResponse
    {
        $this->authorize('update', $logbook);

        $this->logbookService->update($logbook, $request->validated());

        return $this->flashResponse('Logbook berhasil diperbarui.');
    }

    public function destroy(Logbook $logbook): RedirectResponse
    {
        $this->authorize('delete', $logbook);

        $this->logbookService->delete($logbook);

        return $this->flashResponse('Logbook berhasil dihapus.');
    }
}
