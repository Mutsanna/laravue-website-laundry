<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\ExpenseCollection;
use App\Expense;

use Illuminate\Support\Facades\Notification;
use App\Notifications\ExpensesNotification;
use App\User;


class ExpensesController extends Controller
{
    public function index()
    {
        $user = request()->user(); //AMBIL DATA USER YANG SEDANG LOGIN
        $expenses = Expense::with(['user'])->orderBy('created_at', 'DESC'); //GET DATA EXPENSES 
        //YANG DIURUTKAN BERDASARKAN DATA TERBARU BESERTA SEBUAH EAGER LOADING UNTUK MENGAMBIL 
        //SIAPA PEMILIK DATA TERSEBUT

        //APABILA ADA PENCARIAN
        if (request()->q != '') {
            //MAKA AMBIL DATA BERDASARKAN PENCARIAN YANG DILAKUKAN
            $expenses = $expenses->where('description', 'LIKE', '%' . request()->q . '%');
        }

        //JIKA ROLE USER YANG LOGIN ADALAH 1 (ADMIN) & 3 (KURIR), 
        //MAKA AMBIL DATA KHUSUS DATA MEREKA SAJA
        if (in_array($user->role, [1, 3])) {
            $expenses = $expenses->where('user_id', $user->id);
        }
        return (new ExpenseCollection($expenses->paginate(10)));
    }

    public function store(Request $request)
    {
        //VALIDASI DATA YANG DIKIRIM
        $this->validate($request, [
            'description' => 'required|string|max:150',
            'price' => 'required|integer',
            'note' => 'nullable|string'
        ]);

        $user = $request->user(); //GET USER YANG SEDANG LOGIN
        //JIKA USER YANG SEDANG LOGIN ROLENYA SUPERADMIN/FINANCE
        //MAKA SECARA OTOMATIS DI APPROVE, SELAIN ITU STATUSNYA 0 BERARTI HARUS
        //MENUNGGU PERSETUJUAN
        $status = $user->role == 0 || $user->role == 2 ? 1:0; 
        //TAMBAHKAN USER_ID DAN STATUS KE DALAM REQUEST
        $request->request->add([
            'user_id' => $user->id,
            'status' => $status
        ]);

        //KEMUDIAN BUAT RECORD BARU KE DALAM DATABASE
        $expenses = Expense::create($request->all());

        //GET USER YANG ROLE-NYA SUPERADMIN DAN FINANCE
        //KENAPA? KARENA HANYA ROLE ITULAH YANG AKAN MENDAPATKAN NOTIFIKASI
        $users = User::whereIn('role', [0, 2])->get();
        //KIRIM NOTIFIKASINYA MENGGUNAKAN FACADE NOTIFICATION
        Notification::send($users, new ExpensesNotification($expenses, $user));

        return response()->json(['status' => 'success']);
    }

    public function accept(Request $request)
    {
        $this->validate($request, ['id' => 'required|exists:expenses,id']); //VALIDASI DATA
        $expenses = Expense::with(['user'])->find($request->id); //AMBIL SINGLE DATA EXPENSES
        $expenses->update(['status' => 1]); //UBAH STATUSNYA JADI APPROVE
        Notification::send($expenses->user, new ExpensesNotification($expenses, $expenses->user)); //KIRIM NOTIFIKASI KE PEMBUAT REQUEST EXPENSES
        return response()->json(['status' => 'success']);
    }

    public function cancelRequest(Request $request)
    {
        $this->validate($request, ['id' => 'required|exists:expenses,id', 'reason' => 'required|string']); //VALIDASI
        $expenses = Expense::with(['user'])->find($request->id); //AMBIL SINGLE DATA EXPENSES
        $expenses->update(['status' => 2, 'reason' => $request->reason]); //UBAH STATUS DAN TAMBAHKAN REASON
        Notification::send($expenses->user, new ExpensesNotification($expenses, $expenses->user)); //KIRIM NOTIFIKASI
        return response()->json(['status' => 'success']);
    }

    public function edit($id)
    {
        $expenses = Expense::with(['user'])->find($id); //AMBIL DATA BERDASARKAN ID
        return response()->json(['status' => 'success', 'data' => $expenses]);
    }

    public function update(Request $request, $id)
    {
        //VALIDASI
        $this->validate($request, [
            'description' => 'required|string|max:150',
            'price' => 'required|integer',
            'note' => 'nullable|string'
        ]);
        $expenses = Expense::find($id); //AMBIL DATA BERDASARKAN ID
        $expenses->update($request->except('id')); //UPDATE DATA TERSEBUT
        return response()->json(['status' => 'success']);
    }

    public function destroy($id)
    {
        $expenses = Expense::find($id);
        $expenses->delete();
        return response()->json(['status' => 'success']);
    }
}
