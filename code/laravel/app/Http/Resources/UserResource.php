<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        //return parent::toArray($request);
        return [
          'type' => $this->type,
          'username' => $this->username,
          'name' => $this->name,
          'email' => $this->email,
          'photo_filename' => $this->photo_filename,
        ];
    }
}
