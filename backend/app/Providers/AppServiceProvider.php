<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(\App\Repositories\AccountRepository::class);
        $this->app->singleton(\App\Repositories\TransactionRepository::class);
        $this->app->singleton(\App\Services\TransferService::class);
    }
    public function boot(): void
    {
        //
    }
}
