<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(
        private readonly DashboardService $service
    ) {}

    public function index(Request $request)
    {
        $activityFilter = $request->input('activity_filter', 'all');
        $statusFilter = $request->input('status_filter', 'all');

        $dashboardData = $this->service->getDashboardData(
            $activityFilter,
            $statusFilter
        );

        // Add filters to the response
        $dashboardData['filters'] = [
            'activity' => $activityFilter,
            'status' => $statusFilter,
        ];

        return Inertia::render('Admin/Dashboard', $dashboardData);
    }
}
