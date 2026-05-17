import { UserRepository } from "@rensa/db/queries/user.repository";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import { compressImageUnder10MB } from "../../photos/upload/route";

const userRepository = new UserRepository();

/*
  GET /api/profile/[id]
  Fetch user profile by ID along with their rolls and preview photos
*/
export async function GET(
	_req: Request,
	context: { params: Promise<{ id: string }> }
) {
	const { id } = await context.params;
	try {
		const user = await userRepository.getProfileById(id);

		if (!user) {
			return NextResponse.json(
				{ success: false, message: "User not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{
				success: true,
				message: "Successfully fetched user profile!",
				data: {
					user: {
						userId: user.userId,
						username: user.username,
						email: user.email,
						avatarUrl: user.avatarUrl ?? undefined,
					},
				},
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error fetching user:", error);
		return NextResponse.json(
			{ success: false, message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

export async function POST(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) {
		return NextResponse.json(
			{
				success: false,
				message: "Unauthorized. Please login to update profile.",
			},
			{ status: 401 }
		);
	}

	try {
		const contentType = req.headers.get("content-type") ?? "";
		let id = "";
		let username = "";
		let email = "";
		let avatarFile: File | null = null;

		if (contentType.includes("multipart/form-data")) {
			const formData = await req.formData();
			id = String(formData.get("id") ?? "");
			username = String(formData.get("username") ?? "");
			email = String(formData.get("email") ?? "");
			const candidate = formData.get("avatarUrl");
			avatarFile = candidate instanceof File ? candidate : null;
		} else {
			const body = await req.json();
			id = String(body.id ?? "");
			username = String(body.username ?? "");
			email = String(body.email ?? "");
		}

		const user = await userRepository.getProfileById(id);

		if (!user) {
			return NextResponse.json(
				{ success: false, message: "User not found" },
				{ status: 404 }
			);
		}

		if (user.userId !== session.user.id) {
			return NextResponse.json(
				{ success: false, message: "Unauthorized to update this profile" },
				{ status: 403 }
			);
		}

		if (!(username && email)) {
			return NextResponse.json(
				{ success: false, message: "Username and email are required" },
				{ status: 400 }
			);
		}

		let avatarUrl = user.avatarUrl ?? "";
		if (avatarFile) {
			try {
				const idx = avatarUrl.indexOf("user_profile/");
				if (idx !== -1) {
					let publicId = avatarUrl.slice(idx);
					const q = publicId.search(/[?#]/);
					if (q !== -1) {
						publicId = publicId.slice(0, q);
					}
					const lastDot = publicId.lastIndexOf(".");
					if (lastDot !== -1) {
						publicId = publicId.slice(0, lastDot);
					}
					publicId = decodeURIComponent(publicId);
					if (/^[A-Za-z0-9_\\-\\/]+$/.test(publicId)) {
						await cloudinary.uploader.destroy(publicId);
					}
				}
			} catch (err) {
				console.error("Failed to delete old avatar from Cloudinary:", err);
			}

			try {
				const arrayBuffer = await avatarFile.arrayBuffer();
				const buffer = Buffer.from(arrayBuffer);
				const compressedBuffer = await compressImageUnder10MB(buffer);

				const base64File = `data:${avatarFile.type};base64,${compressedBuffer.toString(
					"base64"
				)}`;

				const uploadRes = await cloudinary.uploader.upload(base64File, {
					folder: `user_profile/${session.user.id}`,
					resource_type: "image",
					quality: "auto",
					fetch_format: "auto",
					transformation: [{ width: 200, crop: "limit" }],
				});
				avatarUrl = uploadRes.secure_url;
			} catch (err) {
				console.error("Error uploading new avatar:", err);
				return NextResponse.json(
					{ success: false, message: "Failed to upload new avatar." },
					{ status: 500 }
				);
			}
		}

		const updatedUser = await userRepository.updateProfile({
			avatarUrl,
			email,
			userId: id,
			username,
		});

		if (!updatedUser) {
			return NextResponse.json(
				{ success: false, message: "Failed to update profile." },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{
				success: true,
				message: "Successfully updated user profile!",
				data: {
					user: {
						userId: updatedUser.userId,
						username: updatedUser.username,
						email: updatedUser.email,
						avatarUrl: updatedUser.avatarUrl ?? undefined,
					},
				},
			},
			{ status: 200 }
		);
	} catch (err) {
		console.error("Error updating user:", err);
		return NextResponse.json(
			{ success: false, message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
