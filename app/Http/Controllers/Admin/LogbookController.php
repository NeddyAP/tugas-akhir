<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\LogbookRequest;
use App\Models\Logbook;
use App\Services\LogbookService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\Inertia;

class LogbookController extends Controller
{
    public function __construct(
        protected LogbookService $logbookService
    ) {}

    public function index(Request $request): Response
    {
        return Inertia::render('Admin/Table/LogbookPage', [
            'logbooks' => $this->logbookService->getFilteredLogbooks(
                $request->get('search'),
                $request->input('per_page', 10)
            ),
        ]);
    }

    public function store(LogbookRequest $request): RedirectResponse
    {
        $this->logbookService->create($request->validated());

        return $this->successResponse('Logbook berhasil ditambahkan.');
    }

    public function update(LogbookRequest $request, Logbook $logbook): RedirectResponse
    {
        $this->logbookService->update($logbook, $request->validated());

        return $this->successResponse('Logbook berhasil diperbarui.');
    }

    public function destroy(Logbook $logbook): RedirectResponse
    {
        $this->logbookService->delete($logbook);

        return $this->successResponse('Logbook berhasil dihapus.');
    }

    protected function successResponse(string $message): RedirectResponse
    {
        return redirect()->back()->with('flash', [
            'message' => $message,
            'type' => 'success'
        ]);
    }
}
