import { NextResponse, type NextRequest } from 'next/server';
import { documentsTable } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { getUser } from '@/lib/auth';
import { Document } from '@/types';
import { db } from '@/db';
import { z } from 'zod';

const uuidSchema = z.string().uuid();

const updateDocumentSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  isFavorite: z.boolean().optional(),
});

type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized or failed to get user from Supabase Auth.' },
        { status: 401 },
      );
    }

    const { id } = await params;
    const parsed = uuidSchema.safeParse(id);

    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.message }, { status: 400 });
    }

    const [document] = await db
      .select()
      .from(documentsTable)
      .where(eq(documentsTable.id, parsed.data));

    if (!document || document.userId !== user.id) {
      return NextResponse.json(
        { message: 'Either the document is not found, or you are not allowed to access it.' },
        { status: 404 },
      );
    }

    return NextResponse.json({ document: document satisfies Document }, { status: 200 });
  } catch (error) {
    console.error('Unknown error', error);
    return NextResponse.json(
      { message: 'Internal server error while fetching document' },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized or failed to get user from Supabase Auth.' },
        { status: 401 },
      );
    }

    const { id } = await params;
    const parsedId = uuidSchema.safeParse(id);

    if (!parsedId.success) {
      return NextResponse.json({ message: parsedId.error.message }, { status: 400 });
    }

    const documentId = parsedId.data;

    const body = await req.json();
    const parsedBody = updateDocumentSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json({ message: parsedBody.error.message }, { status: 400 });
    }

    const updateData = parsedBody.data;
    const hasUpdate = Object.values(updateData).some((value) => value !== undefined);

    if (!hasUpdate) {
      return NextResponse.json({ message: 'No content to update.' }, { status: 400 });
    }

    const [existingDocument] = await db
      .select({ userId: documentsTable.userId })
      .from(documentsTable)
      .where(eq(documentsTable.id, documentId));

    if (!existingDocument || existingDocument.userId !== user.id) {
      return NextResponse.json(
        { message: 'Either the document is not found, or you are not allowed to access it.' },
        { status: 404 },
      );
    }

    const { title, content, isFavorite } = updateData;
    const data: Partial<UpdateDocumentInput> = {};

    if (title) data.title = title;
    if (content) data.content = content;
    if (isFavorite !== undefined) data.isFavorite = isFavorite;

    await db
      .update(documentsTable)
      .set({ ...data, updatedAt: sql`now()` })
      .where(eq(documentsTable.id, documentId));

    return NextResponse.json({ message: 'Document updated successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error updating document', error);
    return NextResponse.json(
      { message: 'Internal server error while updating document' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized or failed to get user from Supabase Auth.' },
        { status: 401 },
      );
    }

    const { id } = await params;
    const parsed = uuidSchema.safeParse(id);

    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.message }, { status: 400 });
    }

    const [document] = await db
      .select()
      .from(documentsTable)
      .where(eq(documentsTable.id, parsed.data));

    if (!document || document.userId !== user.id) {
      return NextResponse.json(
        { message: 'Either the document is not found, or you are not allowed to access it.' },
        { status: 404 },
      );
    }

    await db.delete(documentsTable).where(eq(documentsTable.id, parsed.data));
    // return NextResponse.json(null, { status: 204 });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Unknown error', error);
    return NextResponse.json(
      { message: 'Internal server error while deleting document' },
      { status: 500 },
    );
  }
}
