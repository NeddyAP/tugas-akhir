<?php

namespace App\Repositories;

use App\Models\Bimbingan;
use App\Models\DataKkl;
use App\Models\DataKkn;
use App\Models\Logbook;
use App\Models\User;
use Carbon\Carbon;

class DashboardRepository
{
    public function getStatistics()
    {
        return [
            'totalLogbooks' => Logbook::count(),
            'activeUsers' => $this->getActiveUsers(),
            'totalBimbingans' => Bimbingan::count(),
            'completionRate' => $this->calculateCompletionRate(),
            'lastWeekLogbooks' => Logbook::where('created_at', '>=', now()->subWeek())->count(),
            'newUsersThisWeek' => $this->getNewUsers(),
            'todayBimbingans' => Bimbingan::whereDate('created_at', Carbon::today())->count(),
        ];
    }

    private function getActiveUsers(): int
    {
        return User::where('role', 'mahasiswa')
            ->whereHas('logbook', fn ($query) => $query->where('created_at', '>=', now()->subDays(30)))
            ->count();
    }

    private function getNewUsers(): int
    {
        return User::where('role', 'mahasiswa')
            ->where('created_at', '>=', now()->subWeek())
            ->count();
    }

    private function calculateCompletionRate(): float
    {
        $totalKkl = DataKkl::count();
        $totalKkn = DataKkn::count();
        $totalSubmissions = $totalKkl + $totalKkn;

        if ($totalSubmissions === 0) {
            return 0;
        }

        $completedKkl = DataKkl::where('status', 'approved')->count();
        $completedKkn = DataKkn::where('status', 'approved')->count();
        $totalCompleted = $completedKkl + $completedKkn;

        return ($totalCompleted / $totalSubmissions) * 100;
    }

    public function getRecentActivities($typeFilter = 'all', $statusFilter = 'all')
    {
        $statusCase = "CASE 
            WHEN status = 'approved' THEN 'Completed'
            WHEN status = 'rejected' THEN 'Rejected'
            ELSE 'Pending'
        END";

        $kkl = DataKkl::select(
            'id',
            'user_id',
            'judul as description',
            'created_at',
            'updated_at',
            \DB::raw("'KKL' as type"),
            \DB::raw($statusCase.' as status')
        );

        $kkn = DataKkn::select(
            'id',
            'user_id',
            'judul as description',
            'created_at',
            'updated_at',
            \DB::raw("'KKN' as type"),
            \DB::raw($statusCase.' as status')
        );

        if ($statusFilter !== 'all') {
            $mappedStatus = match ($statusFilter) {
                'pending' => 'Pending',
                'approved' => 'Completed',
                'rejected' => 'Rejected',
                default => $statusFilter
            };

            $statusCondition = \DB::raw($statusCase);
            $kkl->where($statusCondition, $mappedStatus);
            $kkn->where($statusCondition, $mappedStatus);
        }
        if ($typeFilter === 'kkl') {
            $query = $kkl;
        } elseif ($typeFilter === 'kkn') {
            $query = $kkn;
        } else {
            $query = $kkl->union($kkn);
        }

        $totalCount = $query->count();

        if ($totalCount === 0) {
            return new \Illuminate\Pagination\LengthAwarePaginator(
                [],
                0,
                5,
                1,
                ['path' => request()->url()]
            );
        }

        $activities = $query->orderBy('updated_at', 'desc')
            ->paginate(5)
            ->through(function ($activity) {
                $user = User::find($activity->user_id);

                return [
                    'title' => "Laporan {$activity->type} - {$user->name}",
                    'time' => Carbon::parse($activity->updated_at)->diffForHumans(),
                    'status' => $activity->status,
                    'type' => strtolower($activity->type),
                    'description' => $activity->description,
                ];
            });

        $activities->total_count = min($totalCount, 25);

        return $activities;
    }
}
