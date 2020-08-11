<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use DB;
use App\User;

class RolePermissionController extends Controller
{
    //METHOD INI UNTUK MENGAMBIL SEMUA ROLE YANG TERSEDIA
    public function getAllRole()
    {
        $roles = Role::all();
        return response()->json(['status' => 'success', 'data' => $roles]);
    }

    //METHOD INI UNTUK MENGAMBIL SEMUA PERMISSION YANG TERSEDIA 
    public function getAllPermission()
    {
        $permission = Permission::all();
        return response()->json(['status' => 'success', 'data' => $permission]);
    }

    //METHOD UNTUK MENGAMBIL PERMISSION YANG DIMILIKI OLEH ROLE TERTENTU
    public function getRolePermission(Request $request)
    {   
        //MELAKUKAN QUERY UNTUK MENGAMBIL PERMISSION NAME BERDASARKAN ROLE_ID
        $hasPermission = DB::table('role_has_permissions')
            ->select('permissions.name')
            ->join('permissions', 'role_has_permissions.permission_id', '=', 'permissions.id')
            ->where('role_id', $request->role_id)->get();
        return response()->json(['status' => 'success', 'data' => $hasPermission]);
    }

    //FUNGSI INI UNTUK MENGATUR PERMISSION DARI ROLE YANG DIPILIH
    public function setRolePermission(Request $request)
    {
        //VALIDASI
        $this->validate($request, [
            'role_id' => 'required|exists:roles,id'
        ]);

        $role = Role::find($request->role_id); //AMBIL ROLE BERDASARKAN ID
        $role->syncPermissions($request->permissions); //SET PERMISSION UNTUK ROLE TERSEBUT
        //syncPermissions BEKERJA CARA MENGHAPUS SEMUA ROLE YANG DIMILIKI, KEMUDIAN
        //MENYIMPAN DATA YANG BARU
        //PARAMETER PERMISSIONS ADALAH ARRAY YANG BERISI NAME PERMISSIONS
        return response()->json(['status' => 'success']);
    }

    //UNTUK MENGATUR ROLE SETIAP USER
    public function setRoleUser(Request $request)
    {
        //VALIDASI
        $this->validate($request, [
            'user_id' => 'required|exists:users,id',
            'role' => 'required'
        ]);

        $user = User::find($request->user_id); //AMBIL USER BERDASARKAN ID
        $user->syncRoles([$request->role]); //SET ROLE UNTUK USER TERKAIT
        return response()->json(['status' => 'success']);
    }
}

