<?php

namespace App\Http\Controllers;

use App\Http\Requests\LogbookRequest;
use App\Http\Traits\ResponseTrait;
use App\Models\Logbook;
use App\Services\BimbinganService;
use App\Services\LogbookService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LogbookController extends Controller
{
    use AuthorizesRequests, ResponseTrait;

    public function __construct(
        protected LogbookService $logbookService,
        protected BimbinganService $bimbinganService
    ) {}

    public function index(Request $request): Response
    {
        $user = auth()->user();
        $userId = $user->id;
        $type = $request->get('type');
        $search = $request->get('search');

        $logbooks = match ($user->role) {
            'dosen' => $this->logbookService->getDosenMahasiswaLogbooks($userId, $search, $type),
            default => $this->logbookService->getUserLogbooks($userId, $search, $type),
        };

        $bimbingans = match ($user->role) {
            'dosen' => $this->bimbinganService->getDosenMahasiswaBimbingans($userId, $search, $type),
            default => $this->bimbinganService->getUserBimbingans($userId, $search, $type),
        };

        return Inertia::render('Front/Logbook/LogbookPage', [
            'logbooks' => $logbooks,
            'bimbingans' => $bimbingans,
            'initialType' => $type,
            'filters' => $request->only(['search', 'type']),
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
