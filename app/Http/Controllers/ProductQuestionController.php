<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductQuestion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductQuestionController extends Controller
{
    public function store(Request $request, $productId)
    {
        $request->validate([
            'question' => 'required|string|max:1000',
            'is_public' => 'nullable|boolean',
        ]);

        $product = Product::findOrFail($productId);

        $question = ProductQuestion::create([
            'user_id' => Auth::id(),
            'product_id' => $product->id,
            'question' => $request->question,
            'is_public' => $request->is_public ?? true,
        ]);

        return back()->with('success', 'Question submitted successfully!');
    }

    public function answer(Request $request, $questionId)
    {
        $request->validate([
            'answer' => 'required|string|max:2000',
        ]);

        $question = ProductQuestion::findOrFail($questionId);

        $question->update([
            'answer' => $request->answer,
            'answered_by' => Auth::id(),
            'answered_at' => now(),
        ]);

        return back()->with('success', 'Answer submitted successfully!');
    }

    public function index()
    {
        $questions = ProductQuestion::with(['user', 'product', 'answeredBy'])
            ->latest()
            ->paginate(20);

        return inertia('Admin/ProductQuestions/Index', [
            'questions' => $questions,
        ]);
    }

    public function show($id)
    {
        $question = ProductQuestion::with(['user', 'product', 'answeredBy'])
            ->findOrFail($id);

        return inertia('Admin/ProductQuestions/Show', [
            'question' => $question,
        ]);
    }

    public function destroy($id)
    {
        $question = ProductQuestion::findOrFail($id);
        $question->delete();

        return back()->with('success', 'Question deleted successfully!');
    }
}
