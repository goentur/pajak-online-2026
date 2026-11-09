<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class QrisController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Contracts\View\View|\Closure|string
     */
    public function index()
    {
        return view('qris.index');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Contracts\View\View|\Closure|string
     */
    public function billing($id)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Contracts\View\View|\Closure|string
     */
    public function etax($id)
    {
        $idbilling = base64_decode($id, true);

        $validator = Validator::make(compact('idbilling'), [
            'idbilling' => 'required|numeric|digits_between:12,22'
        ]);

        if ($validator->fails()) {
            return view('qris.notfound');
        }

        return view('qris.show', ['mode' => 'etax', 'idbilling' => $idbilling]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Contracts\View\View|\Closure|string
     */
    public function pbb($id)
    {
        $idbilling = base64_decode($id, true);

        $validator = Validator::make(compact('idbilling'), [
            'idbilling' => 'required|numeric|digits:20'
        ]);

        if ($validator->fails()) {
            return view('qris.notfound');
        }

        return view('qris.show', ['mode' => 'pbb', 'idbilling' => $idbilling]);
    }
}
