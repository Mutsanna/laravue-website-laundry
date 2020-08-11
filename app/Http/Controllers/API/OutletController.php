<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\OutletCollection;
use App\Outlet;

class OutletController extends Controller
{
    public function index()
    {
        $outlets = Outlet::orderBy('created_at', 'DESC');
        if (request()->q != '') {
            $outlets = $outlets->where('name', 'LIKE', '%' . request()->q . '%');
        }
        return new OutletCollection($outlets->paginate(10));
    }
}
