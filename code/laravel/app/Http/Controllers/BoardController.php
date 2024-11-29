<?php
namespace App\Http\Controllers;

use App\Models\Board;
use Illuminate\Http\Request;

class BoardController extends Controller
{
    // Display a list of all boards
    public function index()
    {
        return response()->json(Board::all());
    }

    // Store a new board
    public function store(Request $request)
    {
        $validated = $request->validate([
            'board_cols' => 'required|integer|min:1',
            'board_rows' => 'required|integer|min:1',
        ]);

        $board = Board::create($validated);
        return response()->json($board, 201);
    }

    // Show a specific board
    public function show($id)
    {
        $board = Board::find($id);
        if (!$board) {
            return response()->json(['message' => 'Board not found'], 404);
        }

        return response()->json($board);
    }

    // Update a board
    public function update(Request $request, $id)
    {
        $board = Board::find($id);
        if (!$board) {
            return response()->json(['message' => 'Board not found'], 404);
        }

        $board->update($request->all());
        return response()->json($board);
    }

    // Delete a board
    public function destroy($id)
    {
        $board = Board::find($id);
        if (!$board) {
            return response()->json(['message' => 'Board not found'], 404);
        }

        $board->delete();
        return response()->json(['message' => 'Board deleted successfully']);
    }
}
