<?php

namespace App\Services;

use App\Repositories\DashboardRepository;
use App\Models\{Tutorial, Question, Panduan};

class DashboardService
{
    public function __construct(
        private readonly DashboardRepository $repository
    ) {}

    public function getDashboardData($activityFilter = 'all', $statusFilter = 'all')
    {
        return [
            'stats' => $this->formatStatistics($this->repository->getStatistics()),
            'recentActivities' => $this->repository->getRecentActivities($activityFilter, $statusFilter),
            'latestTutorial' => Tutorial::latest()->first(),
            'latestFaqs' => Question::latest()->take(3)->get(),
            'latestPanduan' => Panduan::latest()->first(),
        ];
    }

    private function formatStatistics($stats)
    {
        return [
            [
                'title' => 'Total Logbooks',
                'value' => (string) $stats['totalLogbooks'],
                'change' => "+{$stats['lastWeekLogbooks']} minggu ini",
                'changeType' => 'increase',
            ],
            [
                'title' => 'User Aktif',
                'value' => (string) $stats['activeUsers'],
                'change' => "+{$stats['newUsersThisWeek']} baru",
                'changeType' => 'increase',
            ],
            [
                'title' => 'Bimbingans',
                'value' => (string) $stats['totalBimbingans'],
                'change' => "+{$stats['todayBimbingans']} hari ini",
                'changeType' => 'increase',
            ],
            [
                'title' => 'Penyelesaian Laporan',
                'value' => number_format($stats['completionRate'], 0) . '%',
                'change' => '+0.0%',
                'changeType' => 'increase',
            ],
        ];
    }
}
