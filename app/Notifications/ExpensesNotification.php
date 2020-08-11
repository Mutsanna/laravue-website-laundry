<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\BroadcastMessage;

class ExpensesNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     *
     * @return void
     */

    //DEFINSIKAN GLOBAL VARIABLE
    protected $expenses;
    protected $user;

    public function __construct($expenses, $user)
    {
        //ASSIGN DATA YANG DITERIMA KE DALAM GLOBAL VARIABLE
        $this->expenses = $expenses;
        $this->user = $user;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        //JADI KITA MENGGUNAKAN DUA METHOD, SIMPAN KE DATABASE DAN BROADCAST KE PUSHER
        //PUSHER ADALAH PIHAK KETIGA YANG AKAN DIGUNAKAN UNTUK REALTIME NOTIFICATION
        return ['database', 'broadcast'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */

    //FORM DATA YANG DISIMPAN KE DALAM DATABASE
    public function toDatabase($notifiable)
    {
        return [
            'sender_id' => $this->user->id,
            'sender_name' => $this->user->name,
            'expenses' => $this->expenses
        ];
    }

    //FORM DATA YANG AKAN DI BROADCAST
    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'sender_id' => $this->user->id,
            'sender_name' => $this->user->name,
            'expenses' => $this->expenses
        ]);
    }
  
    //SEBENARNYA JIKA TIDAK ADA PERBEDAAN FORM DATA, KITA BISA LANGSUNG MENGGUNAKAN SATU METHOD SAJA YAKNI toArray()

}
